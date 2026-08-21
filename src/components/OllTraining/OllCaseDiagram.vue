<script setup lang="ts">
import { lastLayerView } from '@/cube'
import { computed } from 'vue'

const props = defineProps<{ facelets: string }>()

const grid = computed(() => lastLayerView(props.facelets).grid)

const CELL = (100 - 12) / 3

const cells = computed(() =>
  grid.value.map((facelet, i) => {
    const row = Math.floor(i / 3)
    const col = i % 3
    return {
      x: 6 + col * CELL,
      y: 6 + row * CELL,
      w: CELL - 2,
      h: CELL - 2,
      on: facelet === 'U',
      key: `c${i}`,
    }
  }),
)
</script>

<template>
  <svg class="diagram" viewBox="0 0 100 100" role="img" aria-label="OLL case diagram">
    <rect
      v-for="c in cells"
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
