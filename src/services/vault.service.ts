import { Injectable, OnModuleInit } from "@nestjs/common";
import { IVault, IVaults } from "@interfaces/vault";
import { Interval } from "@nestjs/schedule";
import { INTERVALS } from "@src/constants";


@Injectable()
export class VaultService implements OnModuleInit {
    private vaults: IVaults = { };

    private list = [
      'https://yields.llama.fi/chart/af2343d4-1265-47b1-babf-bfbca90dab56'
    ]


    @Interval(INTERVALS.FETCH_DATA)
    private async fetchVaults(): Promise<void> {
      for (const url of this.list) {
        console.log(`Fetching ${url}`);
        const result = await fetch(url);
        const json = await result.json()
        console.log(json);
        }
    }


    public onModuleInit(): void {
        this.fetchVaults();
        console.log("OnchainDataService initialized");
    }

    public getAllVaults(): IVaults {
        return this.vaults;
    }

    public getVault(address: string): IVault | undefined {
        return this.vaults[address];
    }
}
