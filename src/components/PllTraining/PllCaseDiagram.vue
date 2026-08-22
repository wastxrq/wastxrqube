<script setup lang="ts">
import { COLORS, lastLayerView } from '@/cube'
import { computed } from 'vue'

const props = defineProps<{ facelets: string }>()

const view = computed(() => lastLayerView(props.facelets))

// Layout geometry (0-100 viewBox): a background panel with the U-layer grid in the
// middle and a thin colored flap strip on each side, showing the adjacent side
// stickers — same structure as cube-trainer's original CaseDiagram.vue prototype,
// adapted to this project's percentage-sized/no-size-prop SVG convention.
const MARGIN = 4
const FLAP = 10
const GAP = 1.5
const ORIGIN = MARGIN + FLAP
const CELL = (100 - 2 * ORIGIN) / 3
const GRID = CELL * 3

const gridCells = computed(() =>
  view.value.grid.map((facelet, i) => {
    const row = Math.floor(i / 3)
    const col = i % 3
    return {
      x: ORIGIN + col * CELL,
      y: ORIGIN + row * CELL,
      w: CELL - GAP,
      h: CELL - GAP,
      fill: COLORS[facelet],
      key: `g${i}`,
    }
  }),
)
const topFlaps = computed(() =>
  view.value.top.map((facelet, i) => ({
    x: ORIGIN + i * CELL,
    y: MARGIN,
    w: CELL - GAP,
    h: FLAP - GAP,
    fill: COLORS[facelet],
    key: `t${i}`,
  })),
)
const bottomFlaps = computed(() =>
  view.value.bottom.map((facelet, i) => ({
    x: ORIGIN + i * CELL,
    y: ORIGIN + GRID,
    w: CELL - GAP,
    h: FLAP - GAP,
    fill: COLORS[facelet],
    key: `b${i}`,
  })),
)
const leftFlaps = computed(() =>
  view.value.left.map((facelet, i) => ({
    x: MARGIN,
    y: ORIGIN + i * CELL,
    w: FLAP - GAP,
    h: CELL - GAP,
    fill: COLORS[facelet],
    key: `l${i}`,
  })),
)
const rightFlaps = computed(() =>
  view.value.right.map((facelet, i) => ({
    x: ORIGIN + GRID,
    y: ORIGIN + i * CELL,
    w: FLAP - GAP,
    h: CELL - GAP,
    fill: COLORS[facelet],
    key: `r${i}`,
  })),
)
</script>

<template>
  <svg class="diagram" viewBox="0 0 100 100" role="img" aria-label="PLL case diagram">
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
  </svg>
</template>

<style scoped>
.diagram {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
