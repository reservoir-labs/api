import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ITokenUSDPrices } from "@interfaces/token";
import { CACHE_DURATION } from "@src/constants";

@Injectable()
export class CoinGeckoService implements OnModuleInit
{
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

    constructor(private readonly configService: ConfigService) {}

    private stripDotE(symbol: string): string {
        return symbol.endsWith('.e') ? symbol.slice(0, -2) : symbol;
    }

    private async fetchPriceData(tokenId: string): Promise<number> {
        const url = new URL('https://api.coingecko.com/api/v3/simple/price');
        url.searchParams.append('ids', tokenId);
        url.searchParams.append('vs_currencies', 'usd');

        const headers: Record<string, string> = {
            accept: 'application/json'
        };

        const apiKey = this.configService.get<string>('coingecko_api_key');
        if (apiKey) {
            headers['x-cg-demo-api-key'] = apiKey;
        } else {
            this.logger.warn("COINGECKO_API_KEY env variable not set. Using public API");
        }

        try {
            const response = await fetch(url, { headers });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data[tokenId]?.usd) {
                throw new Error(`Invalid response format for token: ${tokenId}`);
            }

            return data[tokenId].usd;
        } catch (error) {
            this.logger.error(`Failed to fetch price for ${tokenId}: ${error}`);
            return 0;
        }
    }

    private async fetch(symbol: string): Promise<void>
    {
        const cleanSymbol = this.stripDotE(symbol.toLowerCase());
        const tokenId = this.symbolToId[cleanSymbol];
        if (!tokenId) {
            throw new Error(`Unknown token symbol: ${symbol}`);
        }

        try {
            const usdPrice = await this.fetchPriceData(tokenId);
            this.tokens[symbol] = {
                name: symbol,
                symbol,
                usdPrice,
                lastUpdated: Date.now()
            };
        } catch (error) {
            this.logger.error(`Failed to fetch ${symbol}: ${error}`);
        }
    }

    public async onModuleInit(): Promise<void>
    {
        this.logger.log("Fetching native token USD Price");
        await this.fetch(this.ETHEREUM_SYM)
        this.logger.log("Fetching native token USD Price completed");
    }

    public async getCoinPrice(symbol: string): Promise<number>
    {
        const token = this.tokens[symbol];
        const now = Date.now();

        if (!token || now - token.lastUpdated > CACHE_DURATION) {
            await this.fetch(symbol);
        }

        return this.tokens[symbol].usdPrice;
    }
}
