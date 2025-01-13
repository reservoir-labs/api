// src/constants/index.ts

// Contract Addresses
export const CONTRACTS = {
  FACTORY_ADDRESS: '0xDd723D9273642D82c5761a4467fD5265d94a22da' as const,
  WETH: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' as const,
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
