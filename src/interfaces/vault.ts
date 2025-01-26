import { Address } from "viem";

export interface IVault {
  address: Address;
  apy: number;
  apyBase: number;
  apyReward: number;
  TVL: number;
  underlyingAsset: Address;
  defillamaQueryUrl: string;
}

export interface IVaults {
  [key: string]: IVault;
}
