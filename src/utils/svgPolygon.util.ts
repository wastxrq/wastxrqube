import type { DiagramPoint } from '@/types'

/** Point `a` plus point `b` scaled by `s` — e.g. `add(origin, direction, steps)` to walk a lattice. */
export function add(a: DiagramPoint, b: DiagramPoint, s = 1): DiagramPoint {
  return { x: a.x + b.x * s, y: a.y + b.y * s }
}

/** Formats points as an SVG `points` attribute value. */
export function polygon(corners: DiagramPoint[]): string {
  return corners.map((c) => `${c.x},${c.y}`).join(' ')
}

/** Shrinks a quad toward its own centroid by `gap`, so adjacent cells show a thin gap despite not being axis-aligned rects. */
export function inset(corners: DiagramPoint[], gap: number): DiagramPoint[] {
  const cx = corners.reduce((s, c) => s + c.x, 0) / corners.length
  const cy = corners.reduce((s, c) => s + c.y, 0) / corners.length
  return corners.map((c) => {
    const dx = c.x - cx
    const dy = c.y - cy
    const len = Math.hypot(dx, dy) || 1
    const shrink = Math.min(gap, len / 2)
    return { x: c.x - (dx / len) * shrink, y: c.y - (dy / len) * shrink }
  })
}
