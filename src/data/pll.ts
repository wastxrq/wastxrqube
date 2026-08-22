/**
 * * PLL (Permutation of the Last Layer) algorithm data.
 * * Every algorithm here was validated against cubejs: applied to a solved cube, the
 * * entire "bottom two layers" (D face + non-top rows of R/F/L/B) comes back byte-for-byte
 * * unchanged, and the U face stays fully U-colored (co/eo all zero — pure permutation,
 * * no twists/flips), matching the OLL validation pass's rigor for this project's stricter
 * * PLL requirement.
 */

import type { PllCase, PllGroup } from '@/types'

export const pllGroups: PllGroup[] = [
  { name: 'Edges Only', cases: ['H', 'Ua', 'Ub', 'Z'] },
  { name: 'Corners Only', cases: ['Aa', 'Ab', 'E'] },
  { name: 'G Permutations', cases: ['Ga', 'Gb', 'Gc', 'Gd'] },
  { name: 'Adjacent Corner Swap', cases: ['Ja', 'Jb', 'Ra', 'Rb', 'T', 'F'] },
  { name: 'Diagonal Corner Swap', cases: ['Na', 'Nb', 'V', 'Y'] },
]

export const pllCases: Record<string, PllCase> = {
  Aa: { name: 'Aa Perm', algs: ["x' R2 D2 R' U' R D2 R' U R' x"] },
  Ab: { name: 'Ab Perm', algs: ["x' R U' R D2 R' U R D2 R2 x"] },
  E: { name: 'E Perm', algs: ["x' R U' R' D R U R' D' R U R' D R U' R' D' x"] },
  F: { name: 'F Perm', algs: ["R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"] },
  Ga: { name: 'Ga Perm', algs: ["R2 U R' U R' U' R U' R2 U' D R' U R D'"] },
  Gb: { name: 'Gb Perm', algs: ["R' U' R U D' R2 U R' U R U' R U' R2 D"] },
  Gc: { name: 'Gc Perm', algs: ["R2 U' R U' R U R' U R2 D' U R U' R' D"] },
  Gd: { name: 'Gd Perm', algs: ["R U R' U' D R2 U' R U' R' U R' U R2 D'"] },
  H: { name: 'H Perm', algs: ['M2 U M2 U2 M2 U M2'] },
  Ja: { name: 'Ja Perm', algs: ["x R2 F R F' R U2 r' U r U2 x'"] },
  Jb: { name: 'Jb Perm', algs: ["R U R' F' R U R' U' R' F R2 U' R'"] },
  Na: {
    name: 'Na Perm',
    algs: ["R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"],
  },
  Nb: { name: 'Nb Perm', algs: ["R' U R U' R' F' U' F R U R' F R' F' R U' R"] },
  Ra: { name: 'Ra Perm', algs: ["R U' R' U' R U R D R' U' R D' R' U2 R'"] },
  Rb: { name: 'Rb Perm', algs: ["R2 F R U R U' R' F' R U2 R' U2 R"] },
  T: { name: 'T Perm', algs: ["R U R' U' R' F R2 U' R' U' R U R' F'"] },
  Ua: { name: 'Ua Perm', algs: ["M2 U M U2 M' U M2"] },
  Ub: { name: 'Ub Perm', algs: ["M2 U' M U2 M' U' M2"] },
  V: { name: 'V Perm', algs: ["R' U R' U' y R' F' R2 U' R' U R' F R F y'"] },
  Y: { name: 'Y Perm', algs: ["F R U' R' U' R U R' F' R U R' U' R' F R F'"] },
  Z: { name: 'Z Perm', algs: ["M' U M2 U M2 U M' U2 M2"] },
}
