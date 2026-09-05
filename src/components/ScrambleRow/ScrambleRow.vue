<script setup lang="ts">
import { RefreshIcon } from '@/components/icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    scramble: string
    refreshable?: boolean
    refreshDisabled?: boolean
    isLoading?: boolean
    /** How many wrapped lines of scramble text to always reserve height for — see .scramble's comment. */
    minLines?: number
  }>(),
  { minLines: 2 },
)
defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const scrambleMinHeight = computed(() => `calc(1.6rem * 1.3 * ${props.minLines})`)
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
  /* Reserved on the row itself, not the text alone, so text and button stay
     centered together regardless of how many lines the text wraps to.
     Default (2) matches OllTrainerView/PllTrainerView's short scrambles;
     TimerView passes 5 — its WCA scrambles run 18-21 moves/up to 60 chars
     (measured over 190 samples), which wraps to 5 lines at a 320px viewport
     (verified with headless Chrome). */
  min-height: v-bind(scrambleMinHeight);
}
.scramble {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.3;
  text-align: center;
  /* min-width:0 opts out of a flex item's default min-width:auto, which
     would let this grow to fit the scramble on one unwrapped line instead
     of wrapping within the row's available space. */
  flex: 1 1 auto;
  min-width: 0;
}
.scramble-refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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
