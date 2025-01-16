import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as CoinGecko from "coingecko-api";
import { ITokenUSDPrices } from "@interfaces/token";

@Injectable()
export class CoinGeckoService implements OnModuleInit
{
    private mClient: typeof CoinGecko | undefined;
    private tokens: ITokenUSDPrices = {};
    private ETHEREUM_NAME = 'ethereum';
    private readonly logger: Logger = new Logger(CoinGeckoService.name, { timestamp: true });

    // TODO: rename symbol to tokenId or something as we're not really using the symbol
    private async fetch(symbol: string): Promise<void>
    {
        if (this.mClient === undefined) { throw new Error("Client undefined"); }
        const usdPrice: number  =  (
            await this.mClient.simple.price({
                ids: [symbol],
                vs_currencies: ["usd"],
            })
        ).data[symbol].usd;

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
        await this.fetch(this.ETHEREUM_NAME)
        this.logger.log("Fetching native token USD Price completed");
    }

    public getEthPrice(): number
    {
        return this.tokens[this.ETHEREUM_NAME].usdPrice;
    }
}
