<script setup lang="ts">
import { ref } from 'vue'
import { ChevronIcon } from '@/components'

const props = defineProps<{ defaultOpen?: boolean; count?: number; label: string }>()
const open = ref(props.defaultOpen ?? false)
defineExpose({ open })
</script>

<template>
  <div class="panel collapsible" :class="{ open }">
    <div class="collapsible-head" @click="open = !open">
      <slot name="summary">
        <div class="panel-summary">
          <span v-if="count !== undefined" class="count">{{ count }}</span>
          <span class="label">{{ label }}</span>
        </div>
      </slot>
      <ChevronIcon class="chev" />
    </div>
    <div v-if="open" class="collapsible-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.collapsible {
  margin-bottom: 20px;
  overflow: hidden;
}
.collapsible-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 53px;
  padding: 14px 18px;
  cursor: pointer;
}
.collapsible-head:hover {
  background: var(--panel-2);
}
.chev {
  color: var(--muted);
  flex-shrink: 0;
  transition: transform 0.15s;
}
.collapsible.open .chev {
  transform: rotate(180deg);
}
.collapsible-body {
  border-top: 1px solid var(--border);
  padding: 16px 18px;
}
.panel-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}
.panel-summary .count {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 1.2rem;
}
.panel-summary .label {
  color: var(--muted);
  font-size: 1.2rem;
}
</style>
