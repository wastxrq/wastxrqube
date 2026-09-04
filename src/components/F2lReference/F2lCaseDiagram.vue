<script setup lang="ts">
import { COLORS } from '@/cube'
import type { Facelet } from '@/types'
import { f2lPairFacelets } from '@/utils'
import { computed } from 'vue'

const props = defineProps<{ facelets: string }>()

// Only the FR-slot corner+edge pair being solved gets its real color; every other
// sticker (including the rest of the U layer) renders in the neutral
// --cube-inactive gray, matching the Algorithm Presentation Format reference
// style — see f2lPairFacelets.util.ts. --cube-inactive/--cube-grid don't change
// with the app's light/dark theme (see main.css): this diagram is meant to read
// like a printed reference sheet, not app chrome.
const pairFacelets = computed(() => f2lPairFacelets(props.facelets))
const BLANK_FILL = 'var(--cube-inactive)'
// Used both as the backing fill (shows through the thin gaps between cells,
// see faceBodies below) and the per-cell stroke, so grid lines read as one
// consistent black border regardless of which cells are gray vs colored.
const GRID_COLOR = 'var(--cube-grid)'

// Isometric "opened cube corner": U (top rhombus), F (lower-left parallelogram),
// R (lower-right parallelogram), meeting at the shared URF vertex — the standard
// way F2L reference sheets draw a case, since the corner/edge pair can be
// anywhere in the U layer or already (mis)placed in the FR slot itself.
const CELL = 16
const GAP = 1.2
const ORIGIN = { x: 46, y: 6 } // the drawn ULB corner (ULB = ULB corner of U)

// Basis vectors: moving "toward F" or "toward R" on the U face also moves down
// the page, since F/R visually hang below U — this is what makes the top face
// read as a diamond and F/R as the two lower faces sharing its bottom-left and
// bottom-right edges.
const V_TO_F = { x: -Math.cos(Math.PI / 6) * CELL, y: 0.5 * CELL }
const V_TO_R = { x: Math.cos(Math.PI / 6) * CELL, y: 0.5 * CELL }
const V_DOWN = { x: 0, y: CELL }

function add(a: { x: number; y: number }, b: { x: number; y: number }, s = 1) {
  return { x: a.x + b.x * s, y: a.y + b.y * s }
}

/** Point on the U-face lattice: i = steps toward F (0=back/B edge, 3=front/F edge), j = steps toward R (0=left/L edge, 3=right/R edge). */
function pointU(i: number, j: number) {
  return add(add(ORIGIN, V_TO_F, i), V_TO_R, j)
}
/** Point on the F-face lattice, hanging off U's front edge: f = steps down from U (0..3), j = same j as U's (0=L, 3=R/shared edge with R face). */
function pointF(f: number, j: number) {
  return add(pointU(3, j), V_DOWN, f)
}
/** Point on the R-face lattice, hanging off U's right edge: rr = steps down from U (0..3), i = same i as U's (0=B, 3=F/shared edge with F face). */
function pointR(rr: number, i: number) {
  return add(pointU(i, 3), V_DOWN, rr)
}

function polygon(corners: { x: number; y: number }[]) {
  return corners.map((c) => `${c.x},${c.y}`).join(' ')
}

/** Shrinks a quad toward its own centroid by `gap`, so adjacent cells show a thin gap despite not being axis-aligned rects. */
function inset(corners: { x: number; y: number }[], gap: number) {
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

// One black backing polygon per face (its full, un-inset outline), drawn behind
// the individual sticker cells — the GAP margin around/between cells shows this
// through as the grid's black border, instead of showing whatever's behind the
// SVG, and keeps the cube's overall isometric shape visible.
const faceBodies = computed(() => [
  { points: polygon([pointU(0, 0), pointU(0, 3), pointU(3, 3), pointU(3, 0)]), key: 'body-u' },
  { points: polygon([pointF(0, 0), pointF(0, 3), pointF(3, 3), pointF(3, 0)]), key: 'body-f' },
  { points: polygon([pointR(0, 0), pointR(0, 3), pointR(3, 3), pointR(3, 0)]), key: 'body-r' },
])

const cells = computed(() => {
  const f = (i: number) => props.facelets[i] as Facelet
  const fill = (i: number) => (pairFacelets.value.has(i) ? COLORS[f(i)] : BLANK_FILL)
  const out: { points: string; fill: string; key: string }[] = []

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const corners = [
        pointU(row, col),
        pointU(row, col + 1),
        pointU(row + 1, col + 1),
        pointU(row + 1, col),
      ]
      out.push({
        points: polygon(inset(corners, GAP)),
        fill: fill(row * 3 + col),
        key: `u${row}${col}`,
      })
    }
  }

  for (let fRow = 0; fRow < 3; fRow++) {
    for (let col = 0; col < 3; col++) {
      const corners = [
        pointF(fRow, col),
        pointF(fRow, col + 1),
        pointF(fRow + 1, col + 1),
        pointF(fRow + 1, col),
      ]
      out.push({
        points: polygon(inset(corners, GAP)),
        fill: fill(18 + fRow * 3 + col),
        key: `f${fRow}${col}`,
      })
    }
  }

  for (let rRow = 0; rRow < 3; rRow++) {
    for (let col = 0; col < 3; col++) {
      // R's own column (0 = adjacent F, 2 = adjacent B) runs opposite to U's
      // shared "i" axis (0 = back/B, 3 = front/F), so it's placed inverted.
      const iNear = 2 - col
      const iFar = 3 - col
      const corners = [
        pointR(rRow, iNear),
        pointR(rRow, iFar),
        pointR(rRow + 1, iFar),
        pointR(rRow + 1, iNear),
      ]
      out.push({
        points: polygon(inset(corners, GAP)),
        fill: fill(9 + rRow * 3 + col),
        key: `r${rRow}${col}`,
      })
    }
  }

  return out
})
</script>

<template>
  <svg class="diagram" viewBox="0 0 92 108" role="img" aria-label="F2L case diagram">
    <polygon
      v-for="b in faceBodies"
      :key="b.key"
      :points="b.points"
      :fill="GRID_COLOR"
      :stroke="GRID_COLOR"
      stroke-width="0.6"
    />
    <polygon
      v-for="c in cells"
      :key="c.key"
      :points="c.points"
      :fill="c.fill"
      :stroke="GRID_COLOR"
      stroke-width="0.5"
    />
  </svg>
</template>

<style scoped>
.diagram {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
