import { Address } from "viem";

export interface IToken {
  name: string;
  symbol: string;
  contractAddress: Address;
  usdPrice: number | undefined;
  decimals: number;
}

export interface ITokens {
  [key: string]: IToken;
}

export interface ITokenUSDPrice {
  name: string;
  symbol: string;
  usdPrice: number;
}

export interface ITokenUSDPrices {
  [key: string]: ITokenUSDPrice;
}
