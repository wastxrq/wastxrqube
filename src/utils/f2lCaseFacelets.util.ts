import { Cube, caseFaceletsForAlg } from '@/cube/engine'
import type { Facelet } from '@/types'
import { f2lPairFacelets } from './f2lPairFacelets.util'

const ROTATIONS = ['', 'y', 'y2', "y'"] as const
// F2lCaseDiagram.vue only draws U (0-8), R (9-17), F (18-26).
const VISIBLE_MAX = 26

/** How many of the pair's real, identifying stickers (a corner's white/D side
 * never identifies it) land on a drawn face. */
function visibleIdentifyingCount(facelets: string, pair: Set<number>): number {
  let count = 0
  for (const i of pair) {
    if (i > VISIBLE_MAX) continue
    if ((facelets[i] as Facelet) === 'D') continue
    count++
  }
  return count
}

/**
 * Like caseFaceletsForAlg, but also picks whichever whole-cube y-rotation
 * (a pure camera choice — never changes the case or which slot a piece is in)
 * shows the most of the F2L pair's real, identifying stickers on the diagram's
 * 3 drawn faces. Some cases place the pair's colored stickers on the back/left
 * face, invisible by default — e.g. case 8's corner sits at ULB with only its
 * uninformative white sticker on the drawn U face (verified against every case
 * in data/f2l.ts). No-rotation is preferred on ties.
 */
export function f2lCaseDisplayFacelets(alg: string): string {
  const base = Cube.fromString(caseFaceletsForAlg(alg))
  let best = base.asString()
  let bestScore = visibleIdentifyingCount(best, f2lPairFacelets(best))
  for (const rotation of ROTATIONS.slice(1)) {
    const rotated = base.clone()
    rotated.move(rotation)
    const facelets = rotated.asString()
    const score = visibleIdentifyingCount(facelets, f2lPairFacelets(facelets))
    if (score > bestScore) {
      best = facelets
      bestScore = score
    }
  }
  return best
}
