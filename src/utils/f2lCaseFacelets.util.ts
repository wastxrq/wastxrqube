import { Cube, caseFaceletsForAlg } from '@/cube/engine'
import type { Facelet } from '@/types'
import { f2lPairFacelets } from './f2lPairFacelets.util'

const ROTATIONS = ['', 'y', 'y2', "y'"] as const
// F2lCaseDiagram.vue only draws U (0-8), R (9-17), F (18-26).
const VISIBLE_MAX = 26

/** How many of the pair's real, identifying stickers (a corner's white/D side never
 * identifies it — see f2lPairFacelets.util.ts) land on a drawn face. */
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
 * Like caseFaceletsForAlg, but additionally picks whichever whole-cube y-rotation
 * (y/y2/y' — a pure camera choice around the U/D axis, never changes the case
 * itself or which slot a piece is "in") shows the most of the F2L pair's real,
 * identifying stickers on the diagram's 3 drawn faces. Some cases place the
 * corner or edge's colored stickers on the back or left face — invisible in the
 * default (no-rotation) view — e.g. case 8's corner sits at ULB with both its
 * real color stickers on L/B, only its uninformative white sticker on the drawn
 * U face (verified against every case in data/f2l.ts). No-rotation is preferred
 * on ties, so a case that's already fully visible (e.g. most "corner in slot"
 * cases) never gets rotated away from that meaningful position for no reason.
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
