// src/constants/index.ts

// Contract Addresses
export const CONTRACTS = {
  FACTORY_ADDRESS: '' as const,
  WETH: '' as const,
} as const;

// API Endpoints
export const API_ENDPOINT = {
  RPC_URL: 'https://api.avax.network/ext/bc/C/rpc',
} as const;

// Time intervals (in ms)
export const INTERVALS = {
  FETCH_DATA: 60000 as const, // 1 minute
  BLOCK_RANGE: 8640 as const, // Number of blocks to look back
} as const;
