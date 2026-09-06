// cubejs's main entry pulls in lib/solve.js, whose top-level `this.Cube ||
// require('./cube')` breaks under Vite (no implicit `this`) — importing
// lib/cube directly sidesteps it; we don't use solve.js anyway.
// @ts-expect-error -- cubejs ships no type declarations
import Cube from 'cubejs/lib/cube'
import { ROTATION_REMAP } from '../constants'

/** Strip decorative parentheses/whitespace so cubejs can parse an alg string. */
export function normalizeAlg(alg: string): string {
  return alg.replace(/[()]/g, '').replace(/\s+/g, ' ').trim()
}

const faceletsCache = new Map<string, string>()

/**
 * Applies the alg's inverse to a solved cube, then uprights it (undoes any
 * embedded y/x/z) so every case pictures from the same F/U view — running
 * the original alg from this state always returns to solved.
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

// cubejs indices 0-3 are exactly the last layer's 4 corners/edges (URF/UFL/ULB/UBR
// and UR/UF/UL/UB), with index === solved position.
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
 * Like caseFaceletsForAlg, but also normalizes leftover AUF: some PLL algs
 * (Jb, Ra, Rb, Z) have a net U-layer spin that upright() doesn't undo, making
 * fixed pieces look like they cycle. Trying all 4 AUF angles and keeping the
 * one with fewest last-layer pieces displaced recovers the true minimal shape.
 *
 * Total displaced count alone doesn't pick a unique angle: the G perms tie at
 * 6 displaced pieces between a corner-2-swap+edge-4-cycle split and a
 * corner-3-cycle+edge-3-cycle split (verified via cubejs's cp/ep at every AUF
 * angle) — only the 3+3 split matches the reference "double 3-cycle" G perm.
 * Preferring the more balanced split as a tiebreak resolves this without
 * affecting any other case (checked against every case in data/pll.ts).
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
 * Folds whole-cube rotations (`extraRotation` plus any x/y/z in `tokens`)
 * into equivalent face/slice turns, so the result has no rotation tokens.
 * Only a single rotation axis across the sequence is supported (true for
 * every alg in this project's data) — an unsupported second axis is left
 * as a literal token rather than risk an incorrect fold.
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
 * A scramble (pure face/slice turns) that sets up the given alg's case on a
 * physical cube: the alg's inverse, with a random whole-cube y-rotation
 * folded into the move letters for variety, so the same case doesn't always
 * start the same way. Folding doesn't move centers, so the resulting U-layer
 * pattern is rotated relative to the canonical diagram — the same AUF
 * adjustment a solver does by eye. Verified against cubejs: for every case
 * in data/oll.ts, the scrambled pattern always matches some 90° rotation of
 * caseFaceletsForAlg's canonical pattern.
 */
export function scrambleForAlg(alg: string): string {
  const inverted = (Cube.inverse(normalizeAlg(alg)) as string).split(' ')
  // An alg with its own embedded x-rotation (rare) skips the extra y-rotation —
  // this project's data never mixes both axes in one alg.
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
