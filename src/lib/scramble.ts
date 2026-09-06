import type { ScrambleEvent } from '@/types'
import { setSearchDebug } from 'cubing/search'
import { randomScrambleForEvent } from 'cubing/scramble'

// Silences cubing's own console.warn perf logging (e.g. "random333Scramble: 42ms")
// on every scramble — an officially supported debug flag, not ours to work around.
setSearchDebug({ logPerf: false })

/**
 * A WCA-style random-state scramble via the `cubing` package, not a naive
 * random-move sequence. Can take a noticeable moment on first call (it builds
 * lookup tables lazily), so callers need a loading state.
 */
export async function generateScramble(event: ScrambleEvent = '333'): Promise<string> {
  const alg = await randomScrambleForEvent(event)
  return alg.toString()
}
