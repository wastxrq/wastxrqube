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
  /* Reserved on the row itself (not the text alone) so align-items:center
     keeps the text and button centered TOGETHER on the same vertical
     midpoint no matter how many lines the text wraps to — previously the
     button lived in its own fixed strip above the text, which looked fine
     only for the max-line case; for a short (common) scramble the text sat
     centered deep inside the tall reserved box while the button stayed
     pinned at the top, isolated from it. As long as content never exceeds
     this height (see `minLines` below), the row's height stays pinned at
     this floor, so nothing below this component shifts between refreshes
     either — same guarantee as before, just applied one level up.
     Default (2) matches the short, fixed-length setup scrambles
     OllTrainerView/PllTrainerView show. TimerView passes 5: its full
     WCA-style random-state scrambles are far longer — measured, not
     guessed, cubing/scramble's randomScrambleForEvent('333') produces 18-21
     moves / up to 60 chars over 190 sampled scrambles. At a 320px viewport
     this row measures ~281px wide in the real running app, leaving ~231px
     for the text once the button (40px) and this gap (10px) are subtracted;
     a 65-char scramble (margin above the observed 60-char max) wraps to 5
     lines there in the real JetBrains Mono font — verified with headless
     Chrome, not estimated. */
  min-height: v-bind(scrambleMinHeight);
}
.scramble {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.3;
  text-align: center;
  /* A flex item's default min-width:auto would let this grow to fit the
     scramble on one unwrapped line instead of wrapping within the row's
     available space — flex:1 (grow to fill, shrink to fit) + min-width:0
     (opt out of that default) makes it wrap the same way a plain block
     would, which the min-height budget above assumes. */
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
