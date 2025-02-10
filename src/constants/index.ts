// src/constants/index.ts

// Contract Addresses
export const CONTRACTS = {
  FACTORY_ADDRESS: '0x89d235b4a770cb09ee976df814266226a23a9315' as const,
  WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as const,
} as const;

// Time intervals (in ms)
export const INTERVALS = {
  FETCH_DATA: 300000 as const, // 5 minutes
  BLOCK_RANGE: 8640 as const, // Number of blocks to look back
} as const;

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
