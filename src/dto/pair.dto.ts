import { ApiProperty } from '@nestjs/swagger';
import { IPair } from '@interfaces/pair';
import { IToken } from '@interfaces/token';

export class PairDto implements IPair {
  @ApiProperty({
    description: 'The pair contract address',
    example: '0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5'
  })
  address!: string;

  @ApiProperty({
    description: 'Curve ID. 0 for constant product. 1 for stable',
    example: 1
  })
  curveId!: number;

  @ApiProperty({
    description: 'First token in the pair',
    type: 'object',
    additionalProperties: true
  })
  token0!: IToken;

  @ApiProperty({
    description: 'Second token in the pair',
    type: 'object',
    additionalProperties: true
  })
  token1!: IToken;

  @ApiProperty({
    description: 'Current price ratio between tokens',
    example: '13.648737925900864974'
  })
  price!: string;

  @ApiProperty({
    description: 'Fee charged on each swap (e.g. "1%")',
    example: '1%'
  })
  swapFee!: string;

  @ApiProperty({
    description: 'Platform fee percentage (e.g. "25%")',
    example: '25%'
  })
  platformFee!: string;

  @ApiProperty({
    description: 'Reserve amount of token0',
    example: '5456454'
  })
  token0Reserve!: string;

  @ApiProperty({
    description: 'Reserve amount of token1',
    example: '5456454'
  })
  token1Reserve!: string;

  @ApiProperty({
    description: '24h volume for token0',
    example: '4665940.498116731766938627'
  })
  token0Volume!: string;

  @ApiProperty({
    description: '24h volume for token1',
    example: '336487.684316643656557238'
  })
  token1Volume!: string;

  @ApiProperty({
    description: 'Amount of token0Managed',
    example: '336487.684316643656557238'
  })
  token0Managed!: string;

  @ApiProperty({
    description: 'Amount of token1Managed',
    example: '336487.684316643656557238'
  })
  token1Managed!: string;

  @ApiProperty({
    description: 'APR for swaps',
    example: '0.5%'
  })
  swapApr?: string;

  @ApiProperty({
    description: 'APR for supplying liquidity',
    example: '0.5%'
  })
  supplyApr?: string;
}
