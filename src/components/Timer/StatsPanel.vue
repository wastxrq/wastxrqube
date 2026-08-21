<script setup lang="ts">
import { formatTime } from '@/lib'
import { useTimerSessionsStore } from '@/stores'

const store = useTimerSessionsStore()
</script>

<template>
  <div class="stats-panel">
    <div class="stat">
      <div class="label">ao5</div>
      <div class="value">{{ store.ao5 !== null ? formatTime(store.ao5) : '–' }}</div>
    </div>
    <div class="stat">
      <div class="label">ao12</div>
      <div class="value">{{ store.ao12 !== null ? formatTime(store.ao12) : '–' }}</div>
    </div>
    <div class="stat">
      <div class="label">ao100</div>
      <div class="value">{{ store.ao100 !== null ? formatTime(store.ao100) : '–' }}</div>
    </div>
    <div class="stat">
      <div class="label">mean</div>
      <div class="value">{{ store.meanTime !== null ? formatTime(store.meanTime) : '–' }}</div>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  align-content: center;
  width: 100%;
  height: 100%;
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 20px;
}
.stat {
  text-align: center;
}
.stat .label {
  color: var(--muted);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat .value {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  margin-top: 2px;
}
</style>
