<script setup lang="ts">
import { formatTime, pluralCases } from '@/lib'
import { usePllPracticeStore } from '@/stores'
import { CollapsiblePanel } from '../CollapsiblePanel'

const store = usePllPracticeStore()
</script>

<template>
  <CollapsiblePanel
    :default-open="false"
    :count="store.statsByCase.length"
    :label="`${pluralCases(store.statsByCase.length)} практиковано`"
  >
    <p v-if="store.statsByCase.length === 0" class="hint">Ще немає результатів</p>
    <div v-else class="case-list">
      <div v-for="cs in store.statsByCase" :key="cs.caseId" class="case-row">
        <div class="case-row-head">
          <span class="case-name">{{ cs.name }}</span>
          <span class="case-mean">{{ formatTime(cs.mean) }}</span>
        </div>
        <div class="case-times">{{ cs.times.map((t) => formatTime(t)).join(', ') }}</div>
      </div>
    </div>
  </CollapsiblePanel>
</template>

<style scoped>
.hint {
  color: var(--muted);
  font-size: 0.82rem;
  margin: 0;
}
.case-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.case-row-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.case-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.92rem;
}
.case-mean {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 0.85rem;
}
.case-times {
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 0.8rem;
  margin-top: 3px;
  word-break: break-word;
}
</style>
