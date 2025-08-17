import { GenericFactoryABI } from "@abi/GenericFactory";
import { ReservoirPairABI } from "@abi/ReservoirPair";
import { StablePairABI } from "@abi/StablePair";
import { IPair, IPairs } from "@interfaces/pair";
import { IToken, ITokens } from "@interfaces/token";
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Interval } from "@nestjs/schedule";
import { CoinGeckoService } from "@services/coin-gecko.service";
import { DeFiLlamaService } from "@services/defillama.service";
import { Mutex } from "async-mutex";
import {
    erc20Abi,
    formatUnits,
    Address,
    getAddress,
    formatEther,
    http,
    createPublicClient,
    PublicClient, parseUnits
} from "viem";
import { times } from "lodash";
import { CONTRACTS, INTERVALS, WAD } from "@src/constants";
import { avalanche } from "viem/chains";
import { calculateStableSpotPrice, FEE_ACCURACY } from "@reservoir-labs/sdk";
import { mulDiv, wadToNumber } from "@src/utils/math";

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
        private readonly defillamaService: DeFiLlamaService,
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

        // Determine the block range covering the past 24 hours
        const latestBlock = await this.publicClient.getBlockNumber();
        const fromBlock24h = await this.findBlock24hAgo(latestBlock);

        const promises = times(numPairs, async (i: number) => {
            const pairAddress = allPairs[i];
            const baseIndex = i * 8;

            const [token0Address, token1Address, swapFee, platformFee, reserves, token0Managed, token1Managed, currentAPrecise] = [
                pairResults[baseIndex].result,
                pairResults[baseIndex + 1].result,
                pairResults[baseIndex + 2].result,
                pairResults[baseIndex + 3].result,
                pairResults[baseIndex + 4].result,
                pairResults[baseIndex + 5].result as bigint,
                pairResults[baseIndex + 6].result as bigint,
                pairResults[baseIndex + 7].result,
            ];
            const curveId: number = currentAPrecise ? 1 : 0;

            const [token0, token1] = await this.mutex.runExclusive(() => {
                return Promise.all([
                    this.fetchToken(getAddress(token0Address as Address)),
                    this.fetchToken(getAddress(token1Address as Address)),
                ]);
            });

            const [reserve0, reserve1] = reserves as [bigint, bigint, bigint, bigint];

            const price: bigint = this.calcSpotPrice(reserve0, reserve1, token0.decimals, token1.decimals, curveId, currentAPrecise as number);

            const toBlock = latestBlock;
            const fromBlock = fromBlock24h;

            // Fetch swap volumes and APR for the last 24h
            const { accToken0Volume, accToken1Volume, swapApr, tvlUsd } = await this.fetchVolumesAndSwapApr(
                pairAddress,
                latestBlock,
                fromBlock24h,
                token0,
                token1,
                reserve0,
                reserve1,
                swapFee as bigint,
            );

            const [yield0, yield1] = await Promise.all([this.defillamaService.getVaultYield(token0.contractAddress), this.defillamaService.getVaultYield(token1.contractAddress)]);

            const annualizedYield0Usd = wadToNumber(mulDiv(token0Managed, WAD, reserve0)) * (yield0 / 100) * wadToNumber(parseUnits(formatUnits(reserve0 , token0.decimals), 18)) * token0.usdPrice!;
            const annualizedYield1Usd = wadToNumber(mulDiv(token1Managed, WAD, reserve1)) *  (yield1 / 100) * wadToNumber(parseUnits(formatUnits(reserve1 , token1.decimals), 18)) * token1.usdPrice!;

            const supplyApr = (annualizedYield0Usd + annualizedYield1Usd) / tvlUsd * 100;

            this.pairs[pairAddress] = {
                address: pairAddress,
                curveId,
                token0,
                token1,
                price: formatEther(price),
                swapFee: `${(Number(swapFee) / Number(FEE_ACCURACY) * 100)}%`,
                platformFee: `${(Number(platformFee) / Number(FEE_ACCURACY) * 100)}%`,
                token0Reserve: formatUnits(reserve0, token0.decimals),
                token1Reserve: formatUnits(reserve1, token1.decimals),
                token0Volume: formatUnits(accToken0Volume, token0.decimals),
                token1Volume: formatUnits(accToken1Volume, token1.decimals),
                token0Managed: formatUnits(token0Managed, token0.decimals),
                token1Managed: formatUnits(token1Managed, token1.decimals),
                swapApr,
                supplyApr,
            };
        });

        await Promise.all(promises);
    }

    private calcSpotPrice(reserve0: bigint, reserve1: bigint, token0Decimal: number, token1Decimal: number, curveId: number, ampCoefficientPrecise?: number): bigint {
        if (reserve0 === 0n || reserve1 === 0n) return 0n;

        // constant product
        if (curveId === 0) {
            const normalizedReserve0 = reserve0 * 10n ** BigInt(18 - token0Decimal);
            const normalizedReserve1 = reserve1 * 10n ** BigInt(18 - token1Decimal);
            return normalizedReserve1 * WAD / normalizedReserve0;
        }
        else if (curveId === 1 && ampCoefficientPrecise) {
            const result = calculateStableSpotPrice(formatUnits(reserve0, token0Decimal), formatUnits(reserve1, token1Decimal), ampCoefficientPrecise);
            return BigInt(parseUnits(result.toString(), 18))
        } else {
            throw new Error(`Unknown curve type ${curveId}`);
        }
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
                ...this.getContract(pairAddress, StablePairABI),
                functionName: 'getCurrentAPrecise',
            }
        ]);
    }

    private async fetchToken(address: Address): Promise<IToken> {

        const token = this.tokens[address];
        let symbolResult, nameResult, decimalsResult;
        if (!token) {
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
            [symbolResult, nameResult, decimalsResult] = await this.publicClient.multicall({
                contracts: tokenCalls,
            });
        }

        const symbol = token ? token.symbol : symbolResult.result as string;
        this.tokens[address] = {
            name: token ? token.name : nameResult.result as string,
            symbol,
            contractAddress: address,
            usdPrice: await this.coingeckoService.getCoinPrice(symbol),
            decimals: token ? token.decimals : decimalsResult.result as number,
        };

        return this.tokens[address];
    }

    /**
     * Fetch accumulated swap volumes for a pair within the specified block range and
     * compute the corresponding swap APR.
     *
     * The returned `swapApr` is expressed in *percentage form*. For example, a return
     * value of `25` means **25% APR**, *not* `0.25`.
     *
     * @param pairAddress Address of the pair contract
     * @param toBlock     Inclusive ending block for the query
     * @param fromBlock   Inclusive starting block for the query (typically ~24h ago)
     * @param token0      Metadata for token0
     * @param token1      Metadata for token1
     * @param reserve0    Current reserve of token0 in the pair
     * @param reserve1    Current reserve of token1 in the pair
     * @param swapFee     Swap fee for the pair, scaled by `FEE_ACCURACY`
     * @returns Accumulated volumes for both tokens, the swap APR (percentage), and TVL in USD
     */
    private async fetchVolumesAndSwapApr(
        pairAddress: Address,
        toBlock: bigint,
        fromBlock: bigint,
        token0: IToken,
        token1: IToken,
        reserve0: bigint,
        reserve1: bigint,
        swapFee: bigint,
    ): Promise<{ accToken0Volume: bigint; accToken1Volume: bigint; swapApr: number, tvlUsd: number }> {
        // Fetch logs in 2048-block chunks to avoid RPC limits
        const swapLogs: any[] = [];
        for (let start = fromBlock; start <= toBlock; start += 2048n) {
            const end = start + 2047n > toBlock ? toBlock : start + 2047n;
            const logs = await this.publicClient.getLogs({
                address: pairAddress,
                event: {
                    type: 'event',
                    name: 'Swap',
                    inputs: [
                        { type: 'address', name: 'sender', indexed: true },
                        { type: 'bool', name: 'zeroForOne' },
                        { type: 'uint256', name: 'amountIn' },
                        { type: 'uint256', name: 'amountOut' },
                        { type: 'address', name: 'to', indexed: true },
                    ],
                },
                fromBlock: start,
                toBlock: end,
            });
            swapLogs.push(...logs);
        }

        let accToken0Volume: bigint = 0n;
        let accToken1Volume: bigint = 0n;
        let tvlUsd = 0;

        for (const log of swapLogs) {
            const { args } = log;
            if (args && args.amountIn !== undefined && args.amountOut !== undefined) {
                accToken0Volume += args.zeroForOne ? BigInt(args.amountIn) : BigInt(args.amountOut);
                accToken1Volume += args.zeroForOne ? BigInt(args.amountOut) : BigInt(args.amountIn);
            }
        }

        // Calculate swap APR
        let swapAprValue = 0;
        try {
            const volumeToken0 = Number(formatUnits(accToken0Volume, token0.decimals));
            const volumeToken1 = Number(formatUnits(accToken1Volume, token1.decimals));
            const reserve0Float = Number(formatUnits(reserve0, token0.decimals));
            const reserve1Float = Number(formatUnits(reserve1, token1.decimals));

            const price0 = token0.usdPrice ?? 0;
            const price1 = token1.usdPrice ?? 0;

            const totalVolumeUsd = volumeToken0 * price0 + volumeToken1 * price1;
            const feeRateDecimal = Number(swapFee) / Number(FEE_ACCURACY);
            const dailyFeesUsd = (totalVolumeUsd * feeRateDecimal) / 2;

            tvlUsd = reserve0Float * price0 + reserve1Float * price1;

            if (tvlUsd > 0) {
                swapAprValue = (dailyFeesUsd * 365.25) / tvlUsd * 100;
            }
        } catch (error) {
            this.logger.warn(`Failed to calculate swap APR for pair ${pairAddress}: ${error}`);
        }

        return { accToken0Volume, accToken1Volume, swapApr: swapAprValue, tvlUsd };
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

    // Binary-search to find the block whose timestamp is closest to (now - 24 h)
    private async findBlock24hAgo(latestBlock: bigint): Promise<bigint> {
        const targetTimestamp = Math.floor(Date.now() / 1000) - 24 * 60 * 60; // UNIX seconds
        let low = 66600000n;
        let high = latestBlock;
        while (low < high) {
            const mid = (low + high) / 2n;
            const block = await this.publicClient.getBlock({ blockNumber: mid });
            const blockTs = Number(block.timestamp);
            if (blockTs > targetTimestamp) {
                high = mid - 1n;
            } else {
                low = mid + 1n;
            }
        }
        return low;

    }
}
