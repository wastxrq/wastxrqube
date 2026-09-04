<script setup lang="ts">
import { RefreshIcon } from '@/components/icons'
import { useI18n } from 'vue-i18n'

defineProps<{
  scramble: string
  refreshable?: boolean
  refreshDisabled?: boolean
  isLoading?: boolean
}>()
defineEmits<{ refresh: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="scramble-row">
    <div class="scramble">{{ isLoading ? t('common.generatingScramble') : scramble }}</div>
    <button
      v-if="refreshable"
      class="scramble-refresh"
      type="button"
      :title="t('common.newScrambleTitle')"
      :disabled="refreshDisabled"
      @click="$emit('refresh')"
    >
      <RefreshIcon />
    </button>
  </div>
</template>

<style scoped>
.scramble-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}
.scramble {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.3;
  text-align: center;
  /* Reserve height for exactly two lines so switching between a 1-line and a
     2-line scramble doesn't shift the diagram/timer/stats below it. */
  min-height: calc(1.6rem * 1.3 * 2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.scramble-refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
}
.scramble-refresh:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--accent-dim);
}
.scramble-refresh:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
