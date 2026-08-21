<script setup lang="ts">
import { CASE_CARD_MAX_SIZE_PX, CASE_CARD_MIN_SIZE_PX } from '@/constants'

defineProps<{ title: string; name: string; selected: boolean }>()

const cardSize = `clamp(${CASE_CARD_MIN_SIZE_PX}px, 10vw, ${CASE_CARD_MAX_SIZE_PX}px)`
</script>

<template>
  <button class="card" :class="{ selected }" :title="`${title} · ${name}`">
    <div class="card-square">
      <div class="card-diagram"><slot /></div>
    </div>
    <span class="card-name">{{ name }}</span>
  </button>
</template>

<style scoped>
.card {
  width: v-bind(cardSize);
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.card-square {
  width: v-bind(cardSize);
  height: v-bind(cardSize);
  box-sizing: border-box;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--panel-2);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.12s;
}
.card:hover .card-square {
  border-color: var(--accent-dim);
}
.card.selected .card-square {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.card-diagram {
  width: 100%;
  height: 100%;
}
.card-name {
  font-family: var(--font-mono);
  font-size: clamp(0.62rem, 0.9vw, 0.8rem);
  line-height: 1.2;
  color: var(--muted);
  text-align: center;
}
.card:hover .card-name,
.card.selected .card-name {
  color: var(--text);
}
</style>
