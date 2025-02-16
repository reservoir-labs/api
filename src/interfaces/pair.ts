import { IToken } from "@interfaces/token";

export interface IPair {
  address: string;
  curveId: number;
  token0: IToken;
  token1: IToken;
  price: string;
  swapFee: string;
  platformFee: string;
  token0Reserve: string;
  token1Reserve: string;
  token0Volume: string;
  token1Volume: string;
  token0Managed: string;
  token1Managed: string;
  swapApr?: number;
  supplyApr?: number;
}

export interface IPairs {
  [key: string]: IPair;
}
