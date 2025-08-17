import { ApiProperty } from '@nestjs/swagger';
import { IToken } from '@interfaces/token';
import { Address } from 'viem';

export class TokenDto implements IToken {
  @ApiProperty({
    description: 'Token name',
    example: 'Tether USD',
  })
  name!: string;

  @ApiProperty({
    description: 'Token symbol',
    example: 'USDT',
  })
  symbol!: string;

  @ApiProperty({
    description: 'ERC-20 contract address of the token',
    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })
  contractAddress!: Address;

  @ApiProperty({
    description: 'Latest USD price fetched from CoinGecko (undefined if unavailable)',
    example: 1.0,
    nullable: true,
  })
  usdPrice!: number | undefined;

  @ApiProperty({
    description: 'Decimals used by the token contract',
    example: 6,
  })
  decimals!: number;
}
