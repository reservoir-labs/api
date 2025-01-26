import { ApiProperty } from "@nestjs/swagger";
import { Address } from "viem";
import { IVault } from "@interfaces/vault";

export class VaultDto implements IVault {
  @ApiProperty({
    description: 'The vault contract address',
    example: '0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5'
  })
  address!: Address;

  @ApiProperty({
    description: 'APR for supplying liquidity',
    example: 0.1
  })
  supplyAPR!: number;

  @ApiProperty({
    description: 'Total Value Locked',
    example: '5456454'
  })
  TVL!: string;

  @ApiProperty({
    description: 'Underlying asset address',
    example: '0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5'
  })
  underlyingAsset!: Address;

  @ApiProperty({
    description: 'Defillama query URL',
    example: 'https://api.defillama.com/v1/defi/0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5'
  })
  defillamaQueryUrl!: string;
}
