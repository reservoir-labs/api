import { GenericFactoryABI } from "@abi/GenericFactory";
import { ReservoirPairABI } from "@abi/ReservoirPair";
import { IPair, IPairs } from "@interfaces/pair";
import { IToken, ITokens } from "@interfaces/token";
import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Interval } from "@nestjs/schedule";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { Mutex } from "async-mutex";
import { erc20Abi, formatUnits, Address, parseUnits, getAddress, formatEther, http, createPublicClient, PublicClient } from "viem";
import { times } from "lodash";
import { CONTRACTS, INTERVALS} from "@src/constants";
import { avalanche } from "viem/chains";

@Injectable()
export class OnchainDataService implements OnModuleInit {
    private pairs: IPairs = {};
    private tokens: ITokens = {};
    private readonly mutex: Mutex = new Mutex();
    private readonly httpTransport = http(avalanche.rpcUrls.default.http[0]);
    private publicClient: PublicClient = createPublicClient({
        transport: this.httpTransport,
        chain: avalanche,
    });

    private readonly logger: Logger = new Logger(OnchainDataService.name, { timestamp: true });

    public constructor(
        @Inject(forwardRef(() => CoinGeckoService))
        private readonly coingeckoService: CoinGeckoService,
        private readonly configService: ConfigService,
    ) {}

    private getContract(address: Address, abi: any) {
        return { address, abi };
    }

    @Interval(INTERVALS.FETCH_DATA)
    private async fetch(): Promise<void> {
        const factoryContract = this.getContract(CONTRACTS.FACTORY_ADDRESS, GenericFactoryABI);

        const allPairs: Address[] = await this.publicClient.readContract({
            ...factoryContract,
            functionName: 'allPairs',
            args: []
        }) as Address[];

        const numPairs = allPairs.length;

        const pairCalls = allPairs.flatMap((pairAddress) => [
            {
                ...this.getContract(pairAddress, ReservoirPairABI),
                functionName: 'token0',
            },
            {
                ...this.getContract(pairAddress, ReservoirPairABI),
                functionName: 'token1',
            },
            {
                ...this.getContract(pairAddress, ReservoirPairABI),
                functionName: 'swapFee',
            },
            {
                ...this.getContract(pairAddress, ReservoirPairABI),
                functionName: 'platformFee',
            },
            {
                ...this.getContract(pairAddress, ReservoirPairABI),
                functionName: 'getReserves',
            },
            {
                ...this.getContract(pairAddress, ReservoirPairABI),
                functionName: 'token0Managed',
            },
            {
                ...this.getContract(pairAddress, ReservoirPairABI),
                functionName: 'token1Managed',
            }
        ]);

        const pairResults = await this.publicClient.multicall({
            contracts: pairCalls,
        });

        const promises = times(numPairs, async (i: number) => {
            const pairAddress = allPairs[i];
            const baseIndex = i * 7;

            const [token0Address, token1Address, swapFee, platformFee, reserves, token0Managed, token1Managed] = [
                pairResults[baseIndex].result,
                pairResults[baseIndex + 1].result,
                pairResults[baseIndex + 2].result,
                pairResults[baseIndex + 3].result,
                pairResults[baseIndex + 4].result,
                pairResults[baseIndex + 5].result,
                pairResults[baseIndex + 6].result,
            ];

            const [token0, token1] = await this.mutex.runExclusive(() => {
                return Promise.all([
                    this.fetchToken(getAddress(token0Address as Address)),
                    this.fetchToken(getAddress(token1Address as Address)),
                ]);
            });

            const [reserve0, reserve1] = reserves as [bigint, bigint, bigint, bigint];

            const price: bigint = (reserve0 === 0n || reserve1 === 0n)
                ? 0n
                : reserve0 * 10n ** 18n / reserve1;

            const blockNumber = await this.publicClient.getBlockNumber();
            const fromBlock = blockNumber - 2040n
              // - BigInt(INTERVALS.BLOCK_RANGE); // block limit is 2048 blocks.

            const swapLogs = await this.publicClient.getLogs({
                address: pairAddress,
                event: {
                    type: 'event',
                    name: 'Swap',
                    inputs: [
                        { type: 'address', name: 'sender', indexed: true },
                        { type: 'bool', name: 'zeroForOne' },
                        { type: 'uint256', name: 'amountIn' },
                        { type: 'uint256', name: 'amountOut' },
                        { type: 'address', name: 'to', indexed: true }
                    ],
                },
                fromBlock,
                toBlock: blockNumber,
            });

            let accToken0Volume: bigint = 0n;
            let accToken1Volume: bigint = 0n;

            for (const log of swapLogs) {
                const { args } = log;
                if (args) {
                    accToken0Volume = accToken0Volume +
                        (args.amountIn as bigint) + (args.amountOut as bigint);
                    accToken1Volume = accToken1Volume +
                        (args.amountIn as bigint) + (args.amountOut as bigint);
                }
            }

            this.pairs[pairAddress] = {
                address: pairAddress,
                curveId: 0,
                token0,
                token1,
                price: formatEther(price),
                swapFee: `${(Number(swapFee) / 10000)}%`,
                platformFee: `${(Number(platformFee) / 10000)}%`,
                token0Reserve: formatUnits(reserve0, token0.decimals),
                token1Reserve: formatUnits(reserve1, token1.decimals),
                token0Volume: formatUnits(accToken0Volume, token0.decimals),
                token1Volume: formatUnits(accToken1Volume, token1.decimals),
                token0Managed: formatUnits(token0Managed as bigint, token0.decimals),
                token1Managed: formatUnits(token1Managed as bigint, token1.decimals),
            };
        });

        await Promise.all(promises);
        this.calculateUsdPrices();
        this.filterMissingUsdTokens();
    }

    private async fetchToken(address: Address): Promise<IToken> {
        if (address in this.tokens) return this.tokens[address];

        const tokenCalls = [
            {
                ...this.getContract(address, erc20Abi),
                functionName: 'symbol',
            },
            {
                ...this.getContract(address, erc20Abi),
                functionName: 'name',
            },
            {
                ...this.getContract(address, erc20Abi),
                functionName: 'decimals',
            },
        ];

        const [symbolResult, nameResult, decimalsResult] = await this.publicClient.multicall({
            contracts: tokenCalls,
        });

        const token: IToken = {
            name: nameResult.result as string,
            symbol: symbolResult.result as string,
            contractAddress: address,
            usdPrice: undefined,
            decimals: decimalsResult.result as number,
        };

        this.tokens[address] = token;
        return token;
    }

    private calculateUsdPrices(): void
    {
        this.tokens[CONTRACTS.WETH].usdPrice = this.coingeckoService.getEthPrice();
        for (const pairAddress in this.pairs)
        {
            const pair: IPair = this.pairs[pairAddress];
            if (pair.token0.symbol !== "WVET" && pair.token1.symbol !== "WVET")
            {
                continue;
            }
            else if (pair.token0.symbol === "WVET")
            {
                this.tokens[pair.token1.contractAddress].usdPrice =
                  this.coingeckoService.getEthPrice() * parseFloat(pair.price);
            }
            else if (pair.token1.symbol === "WVET")
            {
                this.tokens[pair.token0.contractAddress].usdPrice =
                  this.coingeckoService.getEthPrice() / parseFloat(pair.price);
            }
        }
    }

    private filterMissingUsdTokens(): void
    {
        for (const tokenAddress in this.tokens)
        {
            if (this.tokens[tokenAddress].usdPrice === undefined)
            {
                delete this.tokens[tokenAddress];
            }
        }
    }

    public async onModuleInit(): Promise<void> {
        this.logger.log("Fetching on chain data...");
        await this.fetch();
        this.logger.log("Fetching on chain data completed");
    }

    public getAllPairs(): IPairs
    {
        return this.pairs;
    }

    public getPair(pairAddress: string): IPair | undefined
    {
        return this.pairs[pairAddress];
    }

    public getAllTokens(): ITokens
    {
        return this.tokens;
    }

    public getToken(tokenAddress: string): IToken | undefined
    {
        return this.tokens[tokenAddress];
    }
}
