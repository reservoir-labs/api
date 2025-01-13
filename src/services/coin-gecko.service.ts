import { Injectable, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import * as CoinGecko from "coingecko-api";

@Injectable()
export class CoinGeckoService implements OnModuleInit
{
    private mClient: typeof CoinGecko | undefined;
    private mEthPrice: number = 0;

    @Interval(60000)
    private async fetch(): Promise<void>
    {
        if (this.mClient === undefined) { throw new Error("Client undefined"); }
        this.mEthPrice = (
            await this.mClient.simple.price({
                ids: ["ethereum"],
                vs_currencies: ["usd"],
            })
        ).data.ethereum.usd;
    }

    public onModuleInit(): void
    {
        this.mClient = new CoinGecko();
        this.fetch();
    }

    public getEthPrice(): number
    {
        return this.mEthPrice;
    }
}
