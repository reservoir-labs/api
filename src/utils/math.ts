import { WAD } from '../constants/index.js';

/**
 * Multiply two bigints and divide by a denominator with full precision.
 * Equivalent to Solidity's mulDiv function.
 *
 * @param x - Multiplicand
 * @param y - Multiplier
 * @param denominator - Divisor
 * @returns (x * y) / denominator rounded down
 */
export function mulDiv(x: bigint, y: bigint, denominator: bigint): bigint {
  if (denominator === 0n) throw new Error('mulDiv: division by zero');
  return (x * y) / denominator;
}

/**
 * Multiply two WAD‐scaled values (1e18) and return a WAD‐scaled result.
 *
 * @param x - First operand (WAD‐scaled)
 * @param y - Second operand (WAD‐scaled)
 * @param wad - The base scaling factor (defaults to 1e18)
 * @returns (x * y) / WAD rounded down
 */
export function mulWad(x: bigint, y: bigint, wad: bigint = WAD): bigint {
  return mulDiv(x, y, wad);
}

/**
 * Convert a WAD-scaled bigint to a JS number.
 *
 * @param value - WAD-scaled value
 * @param wad - The base scaling factor (defaults to 1e18)
 * @returns The WAD-scaled value converted to a JS number
 */
export function wadToNumber(value: bigint, wad: bigint = WAD): number {
  // Convert BigInt to string first to avoid numeric overflow then scale down
  return parseFloat(value.toString()) / Number(wad);
}
