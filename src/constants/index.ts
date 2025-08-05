// src/constants/index.ts

// Contract Addresses
export const CONTRACTS = {
  FACTORY_ADDRESS: '0x1A49Bc8464731A08c16EdF17F33CF77db37228a4' as const,
  WETH: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' as const,
} as const;

// Time intervals (in ms)
export const INTERVALS = {
  FETCH_DATA: 300000 as const, // 5 minutes
  BLOCK_RANGE: 8640 as const, // Number of blocks to look back
} as const;

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const WAD = 1_000_000_000_000_000_000n; // 1e18
