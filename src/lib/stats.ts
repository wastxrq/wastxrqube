import type { Solve } from '@/types'

/**
 * Effective time in ms for a solve, honoring DNF/+2 penalties.
 * Returns Infinity for DNF.
 **/
export function effectiveTime(solve: Solve): number {
  if (solve.penalty === 'DNF') return Infinity
  if (solve.penalty === '+2') return solve.time + 2000
  return solve.time
}

/**
 * WCA-style average of the last n solves (chronological array, oldest first).
 * Null if fewer than n solves exist.
 **/
export function average(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null
  const window = solves.slice(-n)
  const times = window.map(effectiveTime)
  const dnfCount = times.filter((t) => t === Infinity).length
  if (n >= 5 && dnfCount > 1) return Infinity
  if (n < 5 && dnfCount > 0) return Infinity
  const sorted = [...times].sort((a, b) => a - b)
  const trimmed = n >= 5 ? sorted.slice(1, -1) : sorted
  if (trimmed.some((t) => t === Infinity)) return Infinity
  const sum = trimmed.reduce((a, b) => a + b, 0)
  return sum / trimmed.length
}

/**
 * Best (lowest) effective time across all solves, ignoring DNFs.
 * Null if every solve is a DNF or there are none.
 **/
export function best(solves: Solve[]): number | null {
  const times = solves.map(effectiveTime).filter((t) => t !== Infinity)
  if (!times.length) return null
  return Math.min(...times)
}

/**
 * Best n-solve average achieved anywhere across the solve history (a sliding-window minimum).
 */
export function bestAverage(solves: Solve[], n: number): number | null {
  let b: number | null = null
  for (let i = n; i <= solves.length; i++) {
    const avg = average(solves.slice(0, i), n)
    if (avg !== null && avg !== Infinity && (b === null || avg < b)) b = avg
  }
  return b
}

/**
 * Mean of all solves. Infinity if any is a DNF (unlike average(),
 * which only trims outliers, mean is thrown off entirely).
 */
export function mean(solves: Solve[]): number | null {
  const times = solves.map(effectiveTime)
  if (!times.length) return null
  if (times.some((t) => t === Infinity)) return Infinity
  return times.reduce((a, b) => a + b, 0) / times.length
}
