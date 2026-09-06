<script setup lang="ts">
import F2lCaseDiagram from './F2lCaseDiagram.vue'

defineProps<{ name: string; algorithm: string; facelets: string }>()
</script>

<template>
  <div class="f2l-card">
    <div class="card-square">
      <div class="card-diagram">
        <F2lCaseDiagram :facelets="facelets" />
      </div>
    </div>
    <span class="card-name">{{ name }}</span>
    <code class="card-alg">{{ algorithm }}</code>
  </div>
</template>

<style scoped>
.f2l-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.card-square {
  width: 100%;
  aspect-ratio: 92 / 108;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--panel-2);
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
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
.card-alg {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text);
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 8px;
  text-align: center;
  word-break: break-word;
}
</style>
