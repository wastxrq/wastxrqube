<script setup lang="ts">
import { COLORS } from '@/cube'
import type { Facelet } from '@/types'
import { add, f2lPairFacelets, inset, polygon } from '@/utils'
import { computed } from 'vue'

const props = defineProps<{ facelets: string }>()

// Only the FR-slot pair being solved gets its real color — everything else
// renders neutral gray, matching the APF reference style. --cube-inactive/
// --cube-grid stay fixed across themes (see main.css) since this reads like
// a printed reference sheet, not app chrome.
const pairFacelets = computed(() => f2lPairFacelets(props.facelets))
const BLANK_FILL = 'var(--cube-inactive)'
// Backing fill (shows through cell gaps) and per-cell stroke, so grid lines
// read as one consistent border.
const GRID_COLOR = 'var(--cube-grid)'

// Isometric "opened cube corner": U (top rhombus), F/R (lower parallelograms)
// meeting at the shared URF vertex — the standard way F2L sheets draw a case.
const CELL = 16
const GAP = 1.2
const ORIGIN = { x: 46, y: 6 }

// Moving "toward F"/"toward R" on U also moves down the page (F/R visually
// hang below U), which is what makes U read as a diamond.
const V_TO_F = { x: -Math.cos(Math.PI / 6) * CELL, y: 0.5 * CELL }
const V_TO_R = { x: Math.cos(Math.PI / 6) * CELL, y: 0.5 * CELL }
const V_DOWN = { x: 0, y: CELL }

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

// One backing polygon per face, drawn behind the sticker cells so GAP's
// margin shows through as the grid's black border.
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
