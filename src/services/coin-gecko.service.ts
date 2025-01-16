import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as CoinGecko from "coingecko-api";
import { ITokenUSDPrices } from "@interfaces/token";

@Injectable()
export class CoinGeckoService implements OnModuleInit
{
    private mClient: typeof CoinGecko | undefined;
    private tokens: ITokenUSDPrices = {};
    private ETHEREUM_SYM = 'eth';
    private readonly logger: Logger = new Logger(CoinGeckoService.name, { timestamp: true });

    // Common token symbols to CoinGecko IDs mapping
    private readonly symbolToId: Record<string, string> = {
        'eth': 'ethereum',
        'weth': 'weth',
        'usdc': 'usd-coin',
        'usdt': 'tether',
        'dai': 'dai',
        'wbtc': 'wrapped-bitcoin',
        'avax': 'avalanche-2',
        'wavax': 'avalanche-2',
        'btc.b': 'bitcoin-avalanche-bridged-btc-b',
        'joe': 'joe'
    };

    private stripDotE(symbol: string): string {
        return symbol.endsWith('.e') ? symbol.slice(0, -2) : symbol;
    }

    // TODO: rename symbol arg to tokenId or something as we're not really using the symbol
    private async fetch(symbol: string): Promise<void>
    {
        if (this.mClient === undefined) { throw new Error("Client undefined"); }

        const cleanSymbol = this.stripDotE(symbol.toLowerCase());
        const tokenId = this.symbolToId[cleanSymbol];
        if (!tokenId) {
            throw new Error(`Unknown token symbol: ${symbol}`);
        }

        const usdPrice: number  =  (
            await this.mClient.simple.price({
                ids: [tokenId],
                vs_currencies: ["usd"],
            })
        ).data[tokenId]?.usd ?? 0;

        this.tokens[symbol] = {
            name: symbol,
            symbol,
            usdPrice
        }
    }

    public async onModuleInit(): Promise<void>
    {
        this.logger.log("Fetching native token USD Price");
        this.mClient = new CoinGecko();
        await this.fetch(this.ETHEREUM_SYM)
        this.logger.log("Fetching native token USD Price completed");
    }

    public getEthPrice(): number
    {
        return this.tokens[this.ETHEREUM_SYM].usdPrice;
    }

    public async getCoinPrice(symbol: string): Promise<number>
    {
        if (this.tokens[symbol] === undefined) await this.fetch(symbol);
        return this.tokens[symbol].usdPrice;
    }
}
