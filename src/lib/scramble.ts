import type { ScrambleEvent } from '@/types'
import { randomScrambleForEvent } from 'cubing/scramble'

/**
 * A WCA-style random-state scramble, generated via the `cubing` package
 * rather than a random-move sequence — the same class of scrambler used by
 * WCA competitions, so scramble difficulty/move distribution isn't biased the
 * way a naive random-move generator's is. Async and can take a noticeable
 * moment on first call (cubing/scramble builds lookup tables lazily), so
 * callers need a loading state — see composables/useScramble.ts.
 */
export async function generateScramble(event: ScrambleEvent = '333'): Promise<string> {
  const alg = await randomScrambleForEvent(event)
  return alg.toString()
}
