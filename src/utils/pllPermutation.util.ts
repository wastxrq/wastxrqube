import { lastLayerView } from '@/cube'
import type { LastLayerView } from '@/types'

const CORNER_INDICES = [0, 2, 6, 8]
const EDGE_INDICES = [1, 3, 5, 7]

type FlapSide = 'top' | 'bottom' | 'left' | 'right'

// Which flap cell(s) border each non-center grid index — mirrors the adjacency
// PllCaseDiagram.vue's own flap layout already encodes (see lastLayerView.ts):
// a corner touches the two flap cells along the sides it borders, an edge touches one.
const SIDES: Record<number, [FlapSide, number][]> = {
  0: [
    ['top', 0],
    ['left', 0],
  ],
  1: [['top', 1]],
  2: [
    ['top', 2],
    ['right', 0],
  ],
  3: [['left', 1]],
  5: [['right', 1]],
  6: [
    ['bottom', 0],
    ['left', 2],
  ],
  7: [['bottom', 1]],
  8: [
    ['bottom', 2],
    ['right', 2],
  ],
}

function tupleFor(view: LastLayerView, gridIndex: number): string {
  return SIDES[gridIndex]!.map(([side, i]) => view[side][i])
    .sort()
    .join('')
}

const SOLVED_FACELETS =
  'U'.repeat(9) + 'R'.repeat(9) + 'F'.repeat(9) + 'D'.repeat(9) + 'L'.repeat(9) + 'B'.repeat(9)
const SOLVED_VIEW = lastLayerView(SOLVED_FACELETS)
const HOME_OF_TUPLE = new Map<string, number>(
  [...CORNER_INDICES, ...EDGE_INDICES].map((i) => [tupleFor(SOLVED_VIEW, i), i]),
)

/**
 * Maps each of the 8 non-center grid positions to the position it belongs at when
 * solved, identifying the piece at each position by its side color(s) (a corner's
 * unordered pair, an edge's single color) — unambiguous because PLL never twists or
 * flips a piece (see src/data/pll.ts's validation note), so a piece's side colors
 * always land on the matching slot's colors, never a rotated/mirrored variant of them.
 */
function homePositions(facelets: string): Map<number, number> {
  const view = lastLayerView(facelets)
  const home = new Map<number, number>()
  for (const i of [...CORNER_INDICES, ...EDGE_INDICES]) {
    const h = HOME_OF_TUPLE.get(tupleFor(view, i))
    if (h !== undefined) home.set(i, h)
  }
  return home
}

function cyclesAmong(home: Map<number, number>, indices: number[]): number[][] {
  const seen = new Set<number>()
  const cycles: number[][] = []
  for (const start of indices) {
    if (seen.has(start) || home.get(start) === start) {
      seen.add(start)
      continue
    }
    let cur = start
    const cycle: number[] = []
    while (!seen.has(cur)) {
      seen.add(cur)
      cycle.push(cur)
      cur = home.get(cur)!
    }
    if (cycle.length > 1) cycles.push(cycle)
  }
  return cycles
}

export interface PllPermutation {
  cornerCycles: number[][]
  edgeCycles: number[][]
}

/**
 * The corner-only and edge-only permutation cycles a PLL case's facelets encode,
 * as grid indices (see lastLayerView.ts's 0-8 layout) in the order pieces travel
 * to reach their solved slot. PLL never mixes corners and edges into the same
 * cycle, so the two piece types are tracked independently.
 */
export function pllPermutationCycles(facelets: string): PllPermutation {
  const home = homePositions(facelets)
  return {
    cornerCycles: cyclesAmong(home, CORNER_INDICES),
    edgeCycles: cyclesAmong(home, EDGE_INDICES),
  }
}
