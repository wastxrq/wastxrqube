<script setup lang="ts">
import { lastLayerView } from '@/cube'
import {
  getBottomFlapRect,
  getGridCellRect,
  getLeftFlapRect,
  getRightFlapRect,
  getTopFlapRect,
} from '@/utils'
import { computed } from 'vue'

const props = defineProps<{ facelets: string }>()

const view = computed(() => lastLayerView(props.facelets))

// Layout geometry mirrors PllCaseDiagram.vue's flap strips; OLL keeps its
// binary on/off color scheme instead of PLL's full sticker colors.
const gridCells = computed(() =>
  view.value.grid.map((facelet, i) => ({
    ...getGridCellRect(i),
    on: facelet === 'U',
    key: `g${i}`,
  })),
)
const topFlaps = computed(() =>
  view.value.top.map((facelet, i) => ({
    ...getTopFlapRect(i),
    on: facelet === 'U',
    key: `t${i}`,
  })),
)
const bottomFlaps = computed(() =>
  view.value.bottom.map((facelet, i) => ({
    ...getBottomFlapRect(i),
    on: facelet === 'U',
    key: `b${i}`,
  })),
)
const leftFlaps = computed(() =>
  view.value.left.map((facelet, i) => ({
    ...getLeftFlapRect(i),
    on: facelet === 'U',
    key: `l${i}`,
  })),
)
const rightFlaps = computed(() =>
  view.value.right.map((facelet, i) => ({
    ...getRightFlapRect(i),
    on: facelet === 'U',
    key: `r${i}`,
  })),
)
</script>

<template>
  <svg class="diagram" viewBox="0 0 100 100" role="img" aria-label="OLL case diagram">
    <rect
      v-for="f in topFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.on ? 'var(--oll-on)' : 'var(--oll-off)'"
    />
    <rect
      v-for="f in bottomFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.on ? 'var(--oll-on)' : 'var(--oll-off)'"
    />
    <rect
      v-for="f in leftFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.on ? 'var(--oll-on)' : 'var(--oll-off)'"
    />
    <rect
      v-for="f in rightFlaps"
      :key="f.key"
      :x="f.x"
      :y="f.y"
      :width="f.w"
      :height="f.h"
      rx="1"
      :fill="f.on ? 'var(--oll-on)' : 'var(--oll-off)'"
    />
    <rect
      v-for="c in gridCells"
      :key="c.key"
      :x="c.x"
      :y="c.y"
      :width="c.w"
      :height="c.h"
      rx="2"
      :fill="c.on ? 'var(--oll-on)' : 'var(--oll-off)'"
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
