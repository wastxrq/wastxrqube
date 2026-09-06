<script setup lang="ts">
import { computed } from 'vue'
import { COLORS } from '@/cube'
import { CUBE_NET_FACE_LAYOUT } from '@/constants'
import type { Facelet } from '@/types'

const props = defineProps<{ facelets: string }>()

const FACE_SIZE = 30
const FACE_GAP = 8
const CELL = FACE_SIZE / 3

const width = 4 * (FACE_SIZE + FACE_GAP) - FACE_GAP
const height = 3 * (FACE_SIZE + FACE_GAP) - FACE_GAP

const cells = computed(() => {
  const out: { x: number; y: number; w: number; h: number; fill: string; key: string }[] = []
  for (const { face, col, row, startIndex } of CUBE_NET_FACE_LAYOUT) {
    const originX = col * (FACE_SIZE + FACE_GAP)
    const originY = row * (FACE_SIZE + FACE_GAP)
    for (let i = 0; i < 9; i++) {
      const cellRow = Math.floor(i / 3)
      const cellCol = i % 3
      const facelet = props.facelets[startIndex + i] as Facelet
      out.push({
        x: originX + cellCol * CELL,
        y: originY + cellRow * CELL,
        w: CELL - 1.5,
        h: CELL - 1.5,
        fill: COLORS[facelet],
        key: `${face}${i}`,
      })
    }
  }
  return out
})
</script>

<template>
  <svg class="net" :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="Cube net diagram">
    <rect
      v-for="c in cells"
      :key="c.key"
      :x="c.x"
      :y="c.y"
      :width="c.w"
      :height="c.h"
      rx="1.2"
      :fill="c.fill"
      stroke="var(--border)"
      stroke-width="1"
    />
  </svg>
</template>

<style scoped>
.net {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
