// Facelet string layout (cubejs / standard Kociemba order):
// index 0-8 = U, 9-17 = R, 18-26 = F, 27-35 = D, 36-44 = L, 45-53 = B
// U grid (row-major): 0=ULB 1=UB 2=UBR / 3=UL 4=center 5=UR / 6=UFL 7=UF 8=URF
//
// Adjacency (derived from the standard cube net and verified against the
// engine): viewed from above with F at the bottom of the picture,
//   top strip (B, reversed):    B3 B2 B1  -> facelets 47 46 45
//   bottom strip (F, direct):   F1 F2 F3  -> facelets 18 19 20
//   left strip (L, direct):     L1 L2 L3  -> facelets 36 37 38 (top to bottom)
//   right strip (R, reversed):  R3 R2 R1  -> facelets 11 10  9 (top to bottom)

import type { Facelet, LastLayerView } from '@/types'

export const COLORS: Record<Facelet, string> = {
  U: '#f4c60a',
  D: '#f2f2f0',
  F: '#1f9d55',
  B: '#2f6fed',
  R: '#d7263d',
  L: '#f2790f',
}

export function lastLayerView(facelets: string): LastLayerView {
  const g = (i: number) => facelets[i] as Facelet
  return {
    grid: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(g),
    top: [47, 46, 45].map(g), // above the grid, left to right
    bottom: [18, 19, 20].map(g), // below the grid, left to right
    left: [36, 37, 38].map(g), // left of the grid, top to bottom
    right: [11, 10, 9].map(g), // right of the grid, top to bottom
  }
}
