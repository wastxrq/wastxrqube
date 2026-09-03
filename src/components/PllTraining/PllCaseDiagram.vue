<script setup lang="ts">
import { COLORS, lastLayerView } from '@/cube'
import {
  getBottomFlapRect,
  getGridCellCenter,
  getGridCellRect,
  getLeftFlapRect,
  getRightFlapRect,
  getTopFlapRect,
  pllPermutationCycles,
} from '@/utils'
import { computed, useId } from 'vue'

const props = defineProps<{ facelets: string }>()

const view = computed(() => lastLayerView(props.facelets))

// Layout geometry (0-100 viewBox): a background panel with the U-layer grid in the
// middle and a thin colored flap strip on each side, showing the adjacent side
// stickers — same structure as cube-trainer's original CaseDiagram.vue prototype,
// adapted to this project's percentage-sized/no-size-prop SVG convention.
const gridCells = computed(() =>
  view.value.grid.map((facelet, i) => ({
    ...getGridCellRect(i),
    fill: COLORS[facelet],
    key: `g${i}`,
  })),
)
const topFlaps = computed(() =>
  view.value.top.map((facelet, i) => ({
    ...getTopFlapRect(i),
    fill: COLORS[facelet],
    key: `t${i}`,
  })),
)
const bottomFlaps = computed(() =>
  view.value.bottom.map((facelet, i) => ({
    ...getBottomFlapRect(i),
    fill: COLORS[facelet],
    key: `b${i}`,
  })),
)
const leftFlaps = computed(() =>
  view.value.left.map((facelet, i) => ({
    ...getLeftFlapRect(i),
    fill: COLORS[facelet],
    key: `l${i}`,
  })),
)
const rightFlaps = computed(() =>
  view.value.right.map((facelet, i) => ({
    ...getRightFlapRect(i),
    fill: COLORS[facelet],
    key: `r${i}`,
  })),
)

// Permutation arrows, overlaid on the grid: a 2-cycle (simple swap) is a straight
// double-headed line. A cycle of 3+ pieces (a 3-cycle for Ua/Ub/Aa/Ab, or the
// G-perms' 4-piece edge zigzag) draws its full closed loop of one straight segment
// per piece (A to B, B to C, ..., back to A) — every piece's move is shown, none
// left implied. Direction is what tells a case apart from its mirror (Aa/Ab,
// Ga/Gb, ...): same segments, arrowheads on the opposite ends.
const arrowheadId = useId()

function cycleSegments(cycle: number[], keyPrefix: string) {
  const points = cycle.map(getGridCellCenter)
  return points.map((from, i) => {
    const to = points[(i + 1) % points.length]!
    return { key: `${keyPrefix}${i}`, x1: from.x, y1: from.y, x2: to.x, y2: to.y }
  })
}

const permutationCycles = computed(() => {
  const { cornerCycles, edgeCycles } = pllPermutationCycles(props.facelets)
  return [...cornerCycles, ...edgeCycles]
})

const swapArrows = computed(() =>
  permutationCycles.value
    .filter((cycle) => cycle.length === 2)
    .map((cycle, i) => {
      const [a, b] = cycle.map(getGridCellCenter)
      return { key: `s${i}`, x1: a!.x, y1: a!.y, x2: b!.x, y2: b!.y }
    }),
)

const cycleArrows = computed(() =>
  permutationCycles.value
    .filter((cycle) => cycle.length > 2)
    .flatMap((cycle, i) => cycleSegments(cycle, `c${i}-`)),
)
</script>

<template>
  <svg class="diagram" viewBox="0 0 100 100" role="img" aria-label="PLL case diagram">
    <defs>
      <marker
        :id="arrowheadId"
        viewBox="0 0 10 10"
        refX="8.5"
        refY="5"
        markerWidth="5.5"
        markerHeight="5.5"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 Z" fill="var(--pll-arrow)" />
      </marker>
    </defs>
    <rect
      v-for="f in topFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.fill"
    />
    <rect
      v-for="f in bottomFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.fill"
    />
    <rect
      v-for="f in leftFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.fill"
    />
    <rect
      v-for="f in rightFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.fill"
    />
    <rect
      v-for="c in gridCells"
      :key="c.key"
      :x="c.x"
      :y="c.y"
      :width="c.w"
      :height="c.h"
      rx="1"
      :fill="c.fill"
    />
    <line
      v-for="a in swapArrows"
      :key="a.key"
      :x1="a.x1"
      :y1="a.y1"
      :x2="a.x2"
      :y2="a.y2"
      stroke="var(--pll-arrow)"
      stroke-width="1.6"
      :marker-start="`url(#${arrowheadId})`"
      :marker-end="`url(#${arrowheadId})`"
    />
    <line
      v-for="a in cycleArrows"
      :key="a.key"
      :x1="a.x1"
      :y1="a.y1"
      :x2="a.x2"
      :y2="a.y2"
      stroke="var(--pll-arrow)"
      stroke-width="1.6"
      :marker-end="`url(#${arrowheadId})`"
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
