// Import the cube.js submodule directly rather than the package's main
// entry point. The main entry also pulls in cubejs's lib/solve.js, whose
// top-level `this.Cube || require('./cube')` relies on an implicit `this`
// binding that Vite's bundler doesn't provide, crashing with
// "Cannot read properties of undefined (reading 'Cube')". We don't use
// solve.js's Cube#solve()/Cube.scramble() (randomScramble() below is our
// own), so importing cube.js alone sidesteps the bug entirely.
// @ts-expect-error -- cubejs ships no type declarations
import Cube from 'cubejs/lib/cube'

/** Strip decorative parentheses/whitespace so cubejs can parse an alg string. */
export function normalizeAlg(alg: string): string {
  return alg.replace(/[()]/g, '').replace(/\s+/g, ' ').trim()
}

const faceletsCache = new Map<string, string>()

/**
 * Given an OLL/PLL algorithm, returns the 54-char facelet string of the
 * "case" it solves: apply the algorithm's inverse to a solved cube, then
 * upright the cube (undo any whole-cube y/x/z rotation baked into the alg)
 * so every case is always pictured from the same F-front, U-top view.
 * Executing the original algorithm from this state always returns to solved.
 */
export function caseFaceletsForAlg(alg: string): string {
  const clean = normalizeAlg(alg)
  const cached = faceletsCache.get(clean)
  if (cached) return cached

  const c = new Cube()
  c.move(Cube.inverse(clean))
  const fix = c.upright()
  if (fix) c.move(fix)
  const facelets = c.asString()
  faceletsCache.set(clean, facelets)
  return facelets
}

const pllFaceletsCache = new Map<string, string>()

// cubejs's own corner/edge indices 0-3 are exactly URF/UFL/ULB/UBR and UR/UF/UL/UB
// (see cube.js's own [URF, UFL, ULB, UBR, ...] / [UR, UF, UL, UB, ...] index tables) —
// i.e. the last layer's 4 corners and 4 edges, with index === solved position.
const LAST_LAYER_PIECE_INDICES = [0, 1, 2, 3]
const AUF_CORRECTIONS = ['U', 'U2', "U'"]

/** Corner/edge counts of last-layer pieces displaced from their solved slot. */
function displacedPieceCounts(c: InstanceType<typeof Cube>): { corner: number; edge: number } {
  let corner = 0
  let edge = 0
  for (const i of LAST_LAYER_PIECE_INDICES) {
    if (c.cp[i] !== i) corner++
    if (c.ep[i] !== i) edge++
  }
  return { corner, edge }
}

/**
 * Like caseFaceletsForAlg, but additionally normalizes away any leftover AUF: some
 * PLL algorithms have a net whole-U-layer rotation baked into their own move count
 * that caseFaceletsForAlg's upright() doesn't undo (upright only fixes which face
 * is F/U, not U-layer spin). Left uncorrected, a handful of cases (Jb, Ra, Rb, Z in
 * this project's data) render with pieces that look like they cycle but don't — e.g.
 * Z showing all 4 corners in a rotated 4-cycle instead of fixed, contradicting its
 * own "Edges Only" category. Trying all 4 AUF angles and keeping whichever leaves
 * the fewest last-layer pieces displaced recovers each case's true, minimal shape.
 *
 * Total displaced piece count alone doesn't always pick a unique angle: the G perms
 * tie at 6 pieces displaced between a corner-2-swap + edge-4-cycle split and a
 * corner-3-cycle + edge-3-cycle split (verified against cubejs's raw cp/ep for every
 * AUF angle on Ga/Gb/Gc/Gd — both splits sum to 6, only the 3+3 split matches the
 * standard reference-sheet "double 3-cycle" G perm diagram). Preferring the more
 * balanced corner/edge split as a tiebreak resolves that without affecting any other
 * PLL case (checked against every case in src/data/pll.ts: the tiebreak only ever
 * changes which of several equally-minimal angles is picked, never picks a worse one).
 */
export function canonicalPllCaseFacelets(alg: string): string {
  const clean = normalizeAlg(alg)
  const cached = pllFaceletsCache.get(clean)
  if (cached) return cached

  const base = Cube.fromString(caseFaceletsForAlg(alg))
  let best = base
  const bestCounts = displacedPieceCounts(base)
  let bestTotal = bestCounts.corner + bestCounts.edge
  let bestImbalance = Math.abs(bestCounts.corner - bestCounts.edge)
  for (const auf of AUF_CORRECTIONS) {
    const rotated = base.clone()
    rotated.move(auf)
    const counts = displacedPieceCounts(rotated)
    const total = counts.corner + counts.edge
    const imbalance = Math.abs(counts.corner - counts.edge)
    if (total < bestTotal || (total === bestTotal && imbalance < bestImbalance)) {
      best = rotated
      bestTotal = total
      bestImbalance = imbalance
    }
  }
  const facelets = best.asString()
  pllFaceletsCache.set(clean, facelets)
  return facelets
}

// How a move token transforms under a whole-cube rotation, keyed by rotation
// label then by the token being resolved (e.g. ROTATION_REMAP.y.R === 'B'
// means "R" performed after a "y" rotation has the same effect as plain "B").
// Generated from and verified against cubejs's own move simulation (applying
// `rotation TOKEN rotation'` must equal applying the table's plain output) —
// see the derivation in the scrambleForAlg() doc comment below.
const ROTATION_REMAP: Record<string, Record<string, string>> = {
  y: {
    U: 'U',
    U2: 'U2',
    "U'": "U'",
    D: 'D',
    D2: 'D2',
    "D'": "D'",
    R: 'B',
    R2: 'B2',
    "R'": "B'",
    L: 'F',
    L2: 'F2',
    "L'": "F'",
    F: 'R',
    F2: 'R2',
    "F'": "R'",
    B: 'L',
    B2: 'L2',
    "B'": "L'",
    u: 'u',
    u2: 'u2',
    "u'": "u'",
    d: 'd',
    d2: 'd2',
    "d'": "d'",
    r: 'b',
    r2: 'b2',
    "r'": "b'",
    l: 'f',
    l2: 'f2',
    "l'": "f'",
    f: 'r',
    f2: 'r2',
    "f'": "r'",
    b: 'l',
    b2: 'l2',
    "b'": "l'",
    M: 'S',
    M2: 'S2',
    "M'": "S'",
    S: "M'",
    S2: 'M2',
    "S'": 'M',
    E: 'E',
    E2: 'E2',
    "E'": "E'",
  },
  "y'": {
    U: 'U',
    U2: 'U2',
    "U'": "U'",
    D: 'D',
    D2: 'D2',
    "D'": "D'",
    R: 'F',
    R2: 'F2',
    "R'": "F'",
    L: 'B',
    L2: 'B2',
    "L'": "B'",
    F: 'L',
    F2: 'L2',
    "F'": "L'",
    B: 'R',
    B2: 'R2',
    "B'": "R'",
    u: 'u',
    u2: 'u2',
    "u'": "u'",
    d: 'd',
    d2: 'd2',
    "d'": "d'",
    r: 'f',
    r2: 'f2',
    "r'": "f'",
    l: 'b',
    l2: 'b2',
    "l'": "b'",
    f: 'l',
    f2: 'l2',
    "f'": "l'",
    b: 'r',
    b2: 'r2',
    "b'": "r'",
    M: "S'",
    M2: 'S2',
    "M'": 'S',
    S: 'M',
    S2: 'M2',
    "S'": "M'",
    E: 'E',
    E2: 'E2',
    "E'": "E'",
  },
  y2: {
    U: 'U',
    U2: 'U2',
    "U'": "U'",
    D: 'D',
    D2: 'D2',
    "D'": "D'",
    R: 'L',
    R2: 'L2',
    "R'": "L'",
    L: 'R',
    L2: 'R2',
    "L'": "R'",
    F: 'B',
    F2: 'B2',
    "F'": "B'",
    B: 'F',
    B2: 'F2',
    "B'": "F'",
    u: 'u',
    u2: 'u2',
    "u'": "u'",
    d: 'd',
    d2: 'd2',
    "d'": "d'",
    r: 'l',
    r2: 'l2',
    "r'": "l'",
    l: 'r',
    l2: 'r2',
    "l'": "r'",
    f: 'b',
    f2: 'b2',
    "f'": "b'",
    b: 'f',
    b2: 'f2',
    "b'": "f'",
    M: "M'",
    M2: 'M2',
    "M'": 'M',
    S: "S'",
    S2: 'S2',
    "S'": 'S',
    E: 'E',
    E2: 'E2',
    "E'": "E'",
  },
  x: {
    U: 'F',
    U2: 'F2',
    "U'": "F'",
    D: 'B',
    D2: 'B2',
    "D'": "B'",
    R: 'R',
    R2: 'R2',
    "R'": "R'",
    L: 'L',
    L2: 'L2',
    "L'": "L'",
    F: 'D',
    F2: 'D2',
    "F'": "D'",
    B: 'U',
    B2: 'U2',
    "B'": "U'",
    u: 'f',
    u2: 'f2',
    "u'": "f'",
    d: 'b',
    d2: 'b2',
    "d'": "b'",
    r: 'r',
    r2: 'r2',
    "r'": "r'",
    l: 'l',
    l2: 'l2',
    "l'": "l'",
    f: 'd',
    f2: 'd2',
    "f'": "d'",
    b: 'u',
    b2: 'u2',
    "b'": "u'",
    M: 'M',
    M2: 'M2',
    "M'": "M'",
    S: 'E',
    S2: 'E2',
    "S'": "E'",
    E: "S'",
    E2: 'S2',
    "E'": 'S',
  },
  "x'": {
    U: 'B',
    U2: 'B2',
    "U'": "B'",
    D: 'F',
    D2: 'F2',
    "D'": "F'",
    R: 'R',
    R2: 'R2',
    "R'": "R'",
    L: 'L',
    L2: 'L2',
    "L'": "L'",
    F: 'U',
    F2: 'U2',
    "F'": "U'",
    B: 'D',
    B2: 'D2',
    "B'": "D'",
    u: 'b',
    u2: 'b2',
    "u'": "b'",
    d: 'f',
    d2: 'f2',
    "d'": "f'",
    r: 'r',
    r2: 'r2',
    "r'": "r'",
    l: 'l',
    l2: 'l2',
    "l'": "l'",
    f: 'u',
    f2: 'u2',
    "f'": "u'",
    b: 'd',
    b2: 'd2',
    "b'": "d'",
    M: 'M',
    M2: 'M2',
    "M'": "M'",
    S: "E'",
    S2: 'E2',
    "S'": 'E',
    E: 'S',
    E2: 'S2',
    "E'": "S'",
  },
  x2: {
    U: 'D',
    U2: 'D2',
    "U'": "D'",
    D: 'U',
    D2: 'U2',
    "D'": "U'",
    R: 'R',
    R2: 'R2',
    "R'": "R'",
    L: 'L',
    L2: 'L2',
    "L'": "L'",
    F: 'B',
    F2: 'B2',
    "F'": "B'",
    B: 'F',
    B2: 'F2',
    "B'": "F'",
    u: 'd',
    u2: 'd2',
    "u'": "d'",
    d: 'u',
    d2: 'u2',
    "d'": "u'",
    r: 'r',
    r2: 'r2',
    "r'": "r'",
    l: 'l',
    l2: 'l2',
    "l'": "l'",
    f: 'b',
    f2: 'b2',
    "f'": "b'",
    b: 'f',
    b2: 'f2',
    "b'": "f'",
    M: 'M',
    M2: 'M2',
    "M'": "M'",
    S: "S'",
    S2: 'S2',
    "S'": 'S',
    E: "E'",
    E2: 'E2',
    "E'": 'E',
  },
}

const EXTRA_ROTATIONS = ['', 'y', "y'", 'y2'] as const

/** Net quarter-turns (1-3) for a rotation token like "y2"/"x'"/"y", or null if `token` isn't a rotation. */
function rotationQuarters(token: string): number | null {
  const match = /^[xyz](2|')?$/.exec(token)
  if (!match) return null
  if (match[1] === '2') return 2
  if (match[1] === "'") return 3
  return 1
}

/**
 * Resolves whole-cube rotations (an optional leading `extraRotation` plus any
 * x/y/z already embedded in `tokens`) into an equivalent sequence of plain
 * face/slice turns, so the result never contains a literal rotation token.
 * Composition only supports a single rotation axis across the sequence
 * (true for every alg in this project's data — mixed x+y in one alg doesn't
 * occur); an unsupported second axis is left as a literal token rather than
 * risk an incorrect fold.
 */
function foldRotations(tokens: string[], extraRotation: string): string[] {
  const sequence = extraRotation ? [extraRotation, ...tokens] : tokens
  let axis: string | null = null
  let quarters = 0
  const out: string[] = []
  for (const token of sequence) {
    const q = rotationQuarters(token)
    if (q !== null) {
      const tokenAxis = token[0]!
      if (axis === null || axis === tokenAxis) {
        axis = tokenAxis
        quarters = (quarters + q) % 4
      }
      continue
    }
    if (quarters === 0 || axis === null) {
      out.push(token)
      continue
    }
    const label = quarters === 1 ? axis : quarters === 2 ? axis + '2' : axis + "'"
    out.push(ROTATION_REMAP[label]?.[token] ?? token)
  }
  return out
}

/**
 * A scramble (pure face/slice turns — no y/x/z) that sets up the given OLL/PLL
 * algorithm's case on a physical cube: the algorithm's inverse, with a random
 * whole-cube y-rotation folded into the move letters (R conjugated to B, etc.)
 * for variety, so the same case doesn't always start from the same first move
 * or AUF. Folding a rotation this way doesn't move centers (it's still pure
 * face turns), so the U-layer orientation pattern comes out rotated relative
 * to the canonical diagram rather than solvable by `alg` verbatim — the same
 * AUF adjustment a solver would do by eye on a real cube, and exactly the
 * technique oll_trainer's timer.js used (applyRotationForAlgorithm), just
 * generalized here to cover the wide/slice moves (r, f, l, M, ...) that show
 * up in this project's alg data. Verified against cubejs: for every case in
 * src/data/oll.ts, the scrambled U-layer pattern always matches some 90°
 * rotation of caseFaceletsForAlg's canonical pattern.
 */
export function scrambleForAlg(alg: string): string {
  const inverted = (Cube.inverse(normalizeAlg(alg)) as string).split(' ')
  // An alg with its own embedded x-rotation (rare — one OLL case) is left as-is
  // rather than composed with an extra y-rotation, since this project's data
  // never mixes both axes in one alg and mixed-axis composition isn't handled.
  const hasEmbeddedX = inverted.some((t) => t[0] === 'x')
  const extraRotation = hasEmbeddedX
    ? ''
    : EXTRA_ROTATIONS[Math.floor(Math.random() * EXTRA_ROTATIONS.length)]!
  return foldRotations(inverted, extraRotation).join(' ')
}

/** Applies a scramble (or any move sequence) to a solved cube and returns its 54-char facelet string. */
export function scrambledFacelets(scramble: string): string {
  const c = new Cube()
  c.move(scramble)
  return c.asString()
}

export { Cube }
