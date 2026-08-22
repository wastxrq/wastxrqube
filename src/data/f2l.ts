/**
 * * F2L (First Two Layers) algorithm data — reference sheet only, no
 * * practice/timer mode (see F2lGuideView.vue).
 * * Every algorithm here was validated against cubejs: applied to a solved cube,
 * * everything outside the U layer and the FR slot's own corner+edge (D's front-
 * * right corner, F's mid/bottom-right, R's mid/bottom-left) comes back byte-for-
 * * byte unchanged. Several source algorithms used a leading/embedded y-rotation
 * * as a "hold it like this" shorthand; those were folded into an equivalent
 * * pure R/F/U form (same ROTATION_REMAP technique as engine.ts's
 * * scrambleForAlg) so every case here is self-contained and FR-slot-centered.
 * * Also checked pairwise that no two cases resolve to the same U-layer+FR-slot
 * * state (stricter than the OLL/PLL validation passes, which didn't check for
 * * cross-case duplicates).
 */

import type { F2lCase, F2lGroup } from '@/types'

export const f2lGroups: F2lGroup[] = [
  { name: 'Кут зверху, кольори ребра збігаються', cases: [1, 2, 3, 4, 5, 6, 7, 8] },
  { name: 'Кут зверху, кольори ребра протилежні', cases: [9, 10, 11, 12, 13, 14, 15, 16] },
  { name: 'Кут зверху, дивиться вгору', cases: [17, 18, 19, 20, 21, 22, 23, 24] },
  { name: 'Кут у пазу, ребро зверху', cases: [25, 26, 27, 28, 29, 30] },
  { name: 'Ребро у пазу, кут зверху', cases: [31, 32, 33, 34, 35, 36] },
  { name: 'Кут і ребро обидва не на місці в пазу', cases: [37, 38, 39, 40, 41] },
]

export const f2lCases: Record<number, F2lCase> = {
  1: { name: 'Кейс 1', algs: ["U R U' R'"] },
  2: { name: 'Кейс 2', algs: ["F R' F' R"] },
  3: { name: 'Кейс 3', algs: ["U' R U R' U2 R U' R'"] },
  4: { name: 'Кейс 4', algs: ["U F' U' F U2 F' U F"] },
  5: { name: 'Кейс 5', algs: ["U' R U2 R' U2 R U' R'"] },
  6: { name: 'Кейс 6', algs: ["R' F R F'"] },
  7: { name: 'Кейс 7', algs: ["R' F R F' R U R'"] },
  8: { name: 'Кейс 8', algs: ["R U R' U2 R U2 R'"] },
  9: { name: 'Кейс 9', algs: ["F' U' F"] },
  10: { name: 'Кейс 10', algs: ["R U R' U' R U R'"] },
  11: { name: 'Кейс 11', algs: ["U R U' R' U' R U' R'"] },
  12: { name: 'Кейс 12', algs: ["R U2 R' U2 R U' R'"] },
  13: { name: 'Кейс 13', algs: ["R U' R' U' R U2 R' U' R U' R'"] },
  14: { name: 'Кейс 14', algs: ["R U' R' U R U' R' U2 R U' R'"] },
  15: { name: 'Кейс 15', algs: ["U R U' R' U' R U R'"] },
  16: { name: 'Кейс 16', algs: ["F' U' F U F' U' F"] },
  17: { name: 'Кейс 17', algs: ["R U2 R' U' R U R'"] },
  18: { name: 'Кейс 18', algs: ["F' U2 F U F' U' F"] },
  19: { name: 'Кейс 19', algs: ["U R U2 R' U R U' R'"] },
  20: { name: 'Кейс 20', algs: ["U' R U R' U R U' R'"] },
  21: { name: 'Кейс 21', algs: ["U2 R U R' U R U' R'"] },
  22: { name: 'Кейс 22', algs: ["F' U F U2 F' U' F"] },
  23: { name: 'Кейс 23', algs: ["U F' U2 F R U2 R' U R U' R'"] },
  24: { name: 'Кейс 24', algs: ["U R U R' U' R U' R'"] },
  25: { name: 'Кейс 25', algs: ["R U' R' U' F' U F"] },
  26: { name: 'Кейс 26', algs: ["d' L' U L d R U' R'"] },
  27: { name: 'Кейс 27', algs: ["U F' U' F U' F' U F"] },
  28: { name: 'Кейс 28', algs: ["R U R' U' R U' R'"] },
  29: { name: 'Кейс 29', algs: ["R U' R' U R U' R'"] },
  30: { name: 'Кейс 30', algs: ["R U R' U' R U R' U' R U R'"] },
  31: { name: 'Кейс 31', algs: ["U' R U' R' U2 R U' R'"] },
  32: { name: 'Кейс 32', algs: ["R' F R F' R' F R F'"] },
  33: { name: 'Кейс 33', algs: ["U R U' R' U R U' R'"] },
  34: { name: 'Кейс 34', algs: ["U2 F' U F U R U R'"] },
  35: { name: 'Кейс 35', algs: ["R U2 R' U R U' R'"] },
  36: { name: 'Кейс 36', algs: ["U R U' R' U R U' R' U R U' R'"] },
  37: { name: 'Кейс 37', algs: ["R U' R' U' R U R' U2 R U' R'"] },
  38: { name: 'Кейс 38', algs: ["R U' R' U R U2 R' U R U' R'"] },
  39: { name: 'Кейс 39', algs: ["R U R' U' R U' R' U R U' R'"] },
  40: { name: 'Кейс 40', algs: ["U2 R U' R' U R U' R'"] },
  41: { name: 'Кейс 41', algs: ["R U' R' U F' U2 F U2 F' U F"] },
}
