import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { IVault, IVaults } from "@interfaces/vault";
import { Interval } from "@nestjs/schedule";
import { INTERVALS } from "@src/constants";

@Injectable()
export class VaultService implements OnModuleInit {
    private vaults: IVaults = { };
    private readonly logger: Logger = new Logger(VaultService.name, { timestamp: true });

    private list: IVault[] = [{
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // dummy value, to fill in with good ones
      apy: 0,
      apyBase: 0,
      apyReward: 0,
      TVL: 0,
      underlyingAsset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      defillamaQueryUrl: 'https://yields.llama.fi/chart/af2343d4-1265-47b1-babf-bfbca90dab56'
    }];

    @Interval(INTERVALS.FETCH_VAULT_DATA)
    private async fetchVaults(): Promise<void> {
      for (const vault of this.list) {
        const result = await fetch(vault.defillamaQueryUrl);
        try {
          const json = await result.json();

          if (!json?.data?.length) {
            throw new Error(`No data returned for vault ${vault.address}`);
          }

          const latest = json.data.at(-1);
          if (!latest) {
            throw new Error(`Unable to get latest data for vault ${vault.address}`);
          }

          const {
            supplyApr,
            apyBase,
            apyReward,
            tvlUsd
          } = latest;

          this.vaults[vault.address] = {
            address: vault.address,
            apy: supplyApr,
            apyBase,
            apyReward,
            TVL: tvlUsd,
            underlyingAsset: vault.underlyingAsset,
            defillamaQueryUrl: vault.defillamaQueryUrl
          }
        } catch (error) {
          this.logger.error(`Error processing vault ${vault.address}:`, error);
        }
      }
    }


    public async onModuleInit(): Promise<void> {
        this.logger.log("Fetching vaults data");
        await this.fetchVaults();
        this.logger.log("Fetching vaults data completed");
    }

    public getAllVaults(): IVaults {
        return this.vaults;
    }

    public getVault(address: string): IVault | undefined {
        return this.vaults[address];
    }
}
