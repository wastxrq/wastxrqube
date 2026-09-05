/** An OLL/PLL/F2L case's algorithm data — same shape across all three, so this is shared rather than redeclared per domain (see data/oll.ts, data/pll.ts, data/f2l.ts). */
export interface CubeCase {
  name: string
  algs: string[]
}
