import { erc20Abi } from "viem";
import { GenericFactoryABI } from "@abi/GenericFactory";
import { ReservoirPairABI } from "@abi/ReservoirPair";
import { IPair, IPairs } from "@interfaces/pair";
import { IToken, ITokens } from "@interfaces/token";
import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Interval } from "@nestjs/schedule";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { Mutex } from "async-mutex";
import { Address, parseUnits, getAddress, formatEther, http, createPublicClient, PublicClient } from "viem";
import { times } from "lodash";
import {API_ENDPOINT, CONTRACTS, INTERVALS} from "@src/constants";

@Injectable()
export class OnchainDataService implements OnModuleInit {
    private pairs: IPairs = {};
    private tokens: ITokens = {};
    private readonly mutex: Mutex = new Mutex();
    private readonly httpTransport = http(API_ENDPOINT.RPC_URL);
    private publicClient: PublicClient = createPublicClient({
        transport: this.httpTransport,
    });

    private readonly logger: Logger = new Logger(OnchainDataService.name, { timestamp: true });

    public constructor(
        @Inject(forwardRef(() => CoinGeckoService))
        private readonly coingeckoService: CoinGeckoService,
        private readonly configService: ConfigService,
    ) {}

    @Interval(INTERVALS.FETCH_DATA)
    private async fetch(): Promise<void> {
        const factoryContract = {
            address: CONTRACTS.FACTORY_ADDRESS,
            abi: GenericFactoryABI,
        };

        const allPairs = await this.publicClient.readContract({
            ...factoryContract,
            functionName: 'allPairs',
        });

        const numPairs = allPairs.length;

        const promises: Promise<void>[] = times(numPairs, async(i: number) => {
            const pairAddress = allPairs[i];

            const pairContract = {
                address: pairAddress,
                abi: ReservoirPairABI,
            };

            const [token0Address, token1Address, swapFee, platformFee, reserves] = await Promise.all([
                this.publicClient.readContract({
                    ...pairContract,
                    functionName: 'token0',
                }),
                this.publicClient.readContract({
                    ...pairContract,
                    functionName: 'token1',
                }),
                this.publicClient.readContract({
                    ...pairContract,
                    functionName: 'swapFee',
                }),
                this.publicClient.readContract({
                    ...pairContract,
                    functionName: 'platformFee',
                }),
                this.publicClient.readContract({
                    ...pairContract,
                    functionName: 'getReserves',
                }),
            ]);

            console.log('reserves', reserves)

            const [token0, token1] = await this.mutex.runExclusive(() => {
                return Promise.all([
                    this.fetchToken(getAddress(token0Address)),
                    this.fetchToken(getAddress(token1Address)),
                ]);
            });

            const [ reserve0, reserve1 ] = reserves as [ reserve0: bigint, reserve1: bigint, lastUpdate: bigint, index: bigint ];

            const reserve0BN: bigint = parseUnits(reserve0.toString(), token0.decimals);
            const reserve1BN: bigint = parseUnits(reserve1.toString(), token1.decimals);

            const price: bigint = (reserve0BN === 0n || reserve1BN === 0n)
                ? 0n
                : reserve0BN * 10n ** 18n / reserve1BN;

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
                token0,
                token1,
                price: formatEther(price),
                swapFee: `${(Number(swapFee) / 100)}%`,
                platformFee: `${(Number(platformFee) / 100)}%`,
                token0Reserve: formatEther(parseUnits(reserve0.toString(), 18 - token0.decimals)),
                token1Reserve: formatEther(parseUnits(reserve1.toString(), 18 - token1.decimals)),
                token0Volume: formatEther(parseUnits(accToken0Volume.toString(), 18 - token0.decimals)),
                token1Volume: formatEther(parseUnits(accToken1Volume.toString(), 18 - token1.decimals)),
            };
        });

        await Promise.all(promises);
        this.calculateUsdPrices();
        this.filterMissingUsdTokens();
    }

    private async fetchToken(address: Address): Promise<IToken>
    {
        if (address in this.tokens) return this.tokens[address];

        const contract = {
            abi: erc20Abi,
            address: address as `0x${string}`,
        };

        const symbol: string = await this.publicClient.readContract({
            ...contract,
            functionName: 'symbol',
        });

        const name: string = await this.publicClient.readContract({
            ...contract,
            functionName: 'name',
        });

        const decimals: number = await this.publicClient.readContract({
            ...contract,
            functionName: 'decimals',
        });

        const token: IToken = {
            name,
            symbol,
            contractAddress: address,
            usdPrice: undefined,
            decimals,
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
