import { GenericFactoryABI } from "@abi/GenericFactory";
import { ReservoirPairABI } from "@abi/ReservoirPair";
import { ConstantProductPairABI } from "@abi/ConstantProductPair";
import { IPair, IPairs } from "@interfaces/pair";
import { IToken, ITokens } from "@interfaces/token";
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Interval } from "@nestjs/schedule";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { Mutex } from "async-mutex";
import {
    erc20Abi,
    formatUnits,
    Address,
    getAddress,
    formatEther,
    http,
    createPublicClient,
    PublicClient,
} from "viem";
import { times } from "lodash";
import { CONTRACTS, INTERVALS } from "@src/constants";
import { arbitrum } from "viem/chains";

@Injectable()
export class OnchainDataService implements OnModuleInit {
    private pairs: IPairs = {};
    private tokens: ITokens = {};
    private readonly mutex: Mutex = new Mutex();
    private readonly httpTransport = http(arbitrum.rpcUrls.default.http[0]);
    private publicClient: PublicClient = createPublicClient({
        transport: this.httpTransport,
        chain: arbitrum,
    });
    private readonly logger: Logger = new Logger(OnchainDataService.name, { timestamp: true });

    public constructor(
        @Inject(CoinGeckoService)
        private readonly coingeckoService: CoinGeckoService,
        private readonly configService: ConfigService,
    ) {}

    @Interval(INTERVALS.FETCH_DATA)
    private async fetch(): Promise<void> {
        const factoryContract = this.getContract(CONTRACTS.FACTORY_ADDRESS, GenericFactoryABI);

        const allPairs: Address[] = await this.publicClient.readContract({
            ...factoryContract,
            functionName: 'allPairs',
            args: []
        }) as Address[];
        const numPairs = allPairs.length;
        const pairCalls = this.generatePairCalls(allPairs)
        const pairResults = await this.publicClient.multicall({
            contracts: pairCalls,
        });

        const promises = times(numPairs, async (i: number) => {
            const pairAddress = allPairs[i];
            const baseIndex = i * 8;

            const [token0Address, token1Address, swapFee, platformFee, reserves, token0Managed, token1Managed, accuracy] = [
                pairResults[baseIndex].result,
                pairResults[baseIndex + 1].result,
                pairResults[baseIndex + 2].result,
                pairResults[baseIndex + 3].result,
                pairResults[baseIndex + 4].result,
                pairResults[baseIndex + 5].result,
                pairResults[baseIndex + 6].result,
                pairResults[baseIndex + 7].result,
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

            const toBlock = await this.publicClient.getBlockNumber();
            const fromBlock = toBlock - 2040n
              // - BigInt(INTERVALS.BLOCK_RANGE); // block limit is 2048 blocks. TODO: paginate the queries until we get 24h worth of logs.

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
                toBlock,
            });

            let accToken0Volume: bigint = 0n;
            let accToken1Volume: bigint = 0n;

            for (const log of swapLogs) {
                const { args } = log;
                if (args) {
                    if (args.amountIn !== undefined && args.amountOut !== undefined) {
                        accToken0Volume += args.zeroForOne ? BigInt(args.amountIn) : BigInt(args.amountOut);
                        accToken1Volume += args.zeroForOne ? BigInt(args.amountOut) : BigInt(args.amountIn);
                    }
                }
            }

            this.pairs[pairAddress] = {
                address: pairAddress,
                curveId: accuracy === undefined ? 1 : 0, // only ConstantProductPair has this public variable named accuracy
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
                swapApr: 0,
            };
        });

        await Promise.all(promises);
    }

    private getContract(address: Address, abi: any) {
        return { address, abi };
    }

    private generatePairCalls(pairs: Address[]) {
        return pairs.flatMap((pairAddress) => [
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
            },
            {
                ...this.getContract(pairAddress, ConstantProductPairABI),
                functionName: 'ACCURACY'
            }
        ]);
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
            usdPrice: await this.coingeckoService.getCoinPrice(symbolResult.result as string),
            decimals: decimalsResult.result as number,
        };

        this.tokens[address] = token;
        return token;
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
