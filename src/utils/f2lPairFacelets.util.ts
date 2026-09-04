// Standard Kociemba corner/edge facelet index tables (0-indexed into the 54-char
// facelet string: 0-8=U, 9-17=R, 18-26=F, 27-35=D, 36-44=L, 45-53=B — see
// cube/lastLayerView.ts's own layout comment), derived from and verified against
// cubejs's own cornerFacelet/edgeFacelet tables (node_modules/cubejs/lib/cube.js).
const CORNER_FACELETS: readonly (readonly [number, number, number])[] = [
  [8, 9, 20], // URF
  [6, 18, 38], // UFL
  [0, 36, 47], // ULB
  [2, 45, 11], // UBR
  [29, 26, 15], // DFR
  [27, 44, 24], // DLF
  [33, 53, 42], // DBL
  [35, 17, 51], // DRB
]
const EDGE_FACELETS: readonly (readonly [number, number])[] = [
  [5, 10], // UR
  [7, 19], // UF
  [3, 37], // UL
  [1, 46], // UB
  [32, 16], // DR
  [28, 25], // DF
  [30, 43], // DL
  [34, 52], // DB
  [23, 12], // FR
  [21, 41], // FL
  [50, 39], // BL
  [48, 14], // BR
]

/** Every F2L algorithm in this project's data solves the same FR slot (see data/f2l.ts). */
const TARGET_CORNER_COLORS = 'DFR'
const TARGET_EDGE_COLORS = 'FR'

function sortedColors(facelets: string, indices: readonly number[]): string {
  return indices
    .map((i) => facelets[i])
    .sort()
    .join('')
}

/**
 * Locates the FR-slot corner and edge piece (identified by their solved D/F/R
 * color signature, not by position — a case's own corner/edge may currently sit
 * anywhere: loose in the U layer, or already in the FR slot but twisted/flipped)
 * within a case's facelets, returning the set of facelet indices that belong to
 * them at their current position. Used to highlight only the F2L pair on an
 * otherwise-blank case diagram (see F2lCaseDiagram.vue).
 */
export function f2lPairFacelets(facelets: string): Set<number> {
  const corner = CORNER_FACELETS.find(
    (trio) => sortedColors(facelets, trio) === TARGET_CORNER_COLORS,
  )
  const edge = EDGE_FACELETS.find((pair) => sortedColors(facelets, pair) === TARGET_EDGE_COLORS)
  return new Set([...(corner ?? []), ...(edge ?? [])])
}
