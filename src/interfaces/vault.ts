import { Address } from "viem";

export interface IVault {
  address: Address;
  supplyAPR: number;
  TVL: string;
  underlyingAsset: Address;
  defillamaQueryUrl: string;
}

export interface IVaults {
  [key: string]: IVault;
}
