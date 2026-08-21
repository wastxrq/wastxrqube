import type { FaceLayoutEntry } from '@/types'

// Standard cross/net layout: U above F, L-F-R-B in a row, D below F.
// Verified against cubejs directly (which facelet indices move under each
// single face turn) rather than assumed: every face's own 0-8 facelet
// numbering already matches a direct, unflipped row-major render in this
// projection — e.g. U's bottom row (local 6,7,8) is exactly the row that
// borders F's top row (local 0,1,2) once placed here, with no per-face
// mirroring needed. This is a different (simpler) transform from
// lastLayerView.ts's top/bottom/left/right flap arrays, which reverse B
// specifically for that view's different geometry (looking down into the
// U layer with the sides bent up) — not a contradiction, just a different
// projection of the same cube.
export const CUBE_NET_FACE_LAYOUT: FaceLayoutEntry[] = [
  { face: 'U', col: 1, row: 0, startIndex: 0 },
  { face: 'L', col: 0, row: 1, startIndex: 36 },
  { face: 'F', col: 1, row: 1, startIndex: 18 },
  { face: 'R', col: 2, row: 1, startIndex: 9 },
  { face: 'B', col: 3, row: 1, startIndex: 45 },
  { face: 'D', col: 1, row: 2, startIndex: 27 },
]
