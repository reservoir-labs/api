import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Address } from "viem";

@Injectable()
export class DeFiLlamaService {
    private readonly logger: Logger = new Logger(DeFiLlamaService.name, { timestamp: true });
    private readonly baseUrl = 'https://yields.llama.fi/chart';
    private readonly assetToPoolId: Record<Address, string> = {
      '0x152b9d0FdC40C096757F570A51E494bd4b943E50': 'a80c1479-5390-4ce9-b2b8-85bdb5fc5d7f',
      '0x50b7545627a5162F82A992c33b87aDc75187B218': '0d48bd08-1b4d-4663-b99c-69967b255c35'
    }

    constructor(private readonly configService: ConfigService) {}

    /**
     * Get current TVL for a protocol on a specific chain
     * @param asset The asset for which there is an associated vault.
     * @returns yield in APY
     */
    public async getVaultYield(asset: string): Promise<number> {
        const poolId = this.assetToPoolId[asset];
        if (poolId === undefined) return 0;

        const url = `${this.baseUrl}/${poolId}`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rawData = await response.json();
            const data = rawData.data;
            const latest = data.at(-1);

            return latest.apy;
        } catch (error) {
            this.logger.error(`Failed to fetch TVL using url ${url}for ${poolId}: ${error}`);
            return 0;
        }
    }
}
