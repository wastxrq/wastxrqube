<script setup lang="ts">
import { CubeNet, PageSection, StatsPanel, TimerHistory } from '@/components'
import { ScrambleRow } from '@/components/ScrambleRow'
import {
  useDeleteHotkey,
  useHoldTimer,
  useHoldTimerInput,
  useInputMethod,
  useScramble,
} from '@/composables'
import { TIMER_CONSTANTS } from '@/constants'
import { scrambledFacelets } from '@/cube'
import { effectiveTime, formatTime } from '@/lib'
import { useTimerSessionsStore } from '@/stores'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useTimerSessionsStore()
const { isTouch } = useInputMethod()
const { scramble, isLoading: isScrambleLoading, generate: generateScramble } = useScramble()
const facelets = computed(() => scrambledFacelets(scramble.value))

const timer = useHoldTimer({
  inspectionMs: TIMER_CONSTANTS.INSPECTION_MS,
  onComplete: (ms, penalty) => {
    store.addSolve(ms, scramble.value, penalty)
    generateScramble()
  },
})

const timerColor = computed(() => {
  if (timer.state.value === 'holding') return 'var(--danger)'
  if (timer.state.value === 'ready') return 'var(--accent)'
  if (timer.state.value === 'inspecting')
    return timer.armed.value ? 'var(--accent)' : 'var(--amber)'
  return 'var(--text)'
})

const inspectionRemaining = computed(() =>
  Math.max(0, Math.ceil((TIMER_CONSTANTS.INSPECTION_MS - timer.inspectionElapsed.value) / 1000)),
)

/**
 * While idle, keep showing the last result (with any penalty applied) rather than resetting to 0.00 —
 * derived from the store so editing the last solve's penalty in the history list stays in sync here too.
 */
const lastSolve = computed(() => store.solves[store.solves.length - 1])
const lastSolveIndex = computed(() => store.solves.length - 1)
const shownMs = computed(() => {
  if (timer.state.value !== 'idle') return timer.elapsed.value
  return lastSolve.value ? effectiveTime(lastSolve.value) : 0
})

const displayText = computed(() =>
  timer.state.value === 'inspecting'
    ? String(inspectionRemaining.value)
    : formatTime(shownMs.value),
)

const hintText = computed(() => {
  if (timer.state.value === 'inspecting')
    return isTouch.value ? t('timer.hintInspectingTouch') : t('timer.hintInspecting')
  if (timer.state.value === 'idle' && isScrambleLoading.value) return t('common.generatingScramble')
  return isTouch.value ? t('timer.hintIdleTouch') : t('timer.hintIdle')
})

// Esc already cancels inspection on desktop; swipe right is its touch
// equivalent (see useHoldTimerInput) — surfaced here since it's not otherwise
// discoverable the way a labeled button would be.
const showSwipeCancelHint = computed(() => isTouch.value && timer.state.value === 'inspecting')

useDeleteHotkey({
  enabled: () => timer.state.value !== 'running' && store.solves.length > 0,
  onDelete: () => store.deleteSolve(store.solves.length - 1),
})

// Only blocks starting a fresh hold — press() still needs to run in every
// other state (e.g. to stop a running solve) regardless of a background
// scramble regeneration.
const { onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useHoldTimerInput(timer, {
  canStart: () => !isScrambleLoading.value,
  onCancelKey: () => timer.cancel(),
})
</script>

<template>
  <div>
    <h1>{{ t('timer.title') }}</h1>

    <PageSection class="practice">
      <ScrambleRow
        class="scramble-slot"
        :scramble="scramble"
        :is-loading="isScrambleLoading"
        :min-lines="5"
        refreshable
        :refresh-disabled="timer.state.value !== 'idle' || isScrambleLoading"
        @refresh="generateScramble"
      />

      <div class="timer-block">
        <div
          class="timer-touch-zone"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
        >
          <div class="timer-display" :style="{ color: timerColor }">{{ displayText }}</div>
          <p class="hint">{{ hintText }}</p>
          <p v-if="showSwipeCancelHint" class="swipe-hint">{{ t('timer.swipeCancelHint') }}</p>
        </div>

        <div v-if="lastSolve && timer.state.value === 'idle'" class="quick-actions">
          <button
            class="quick-btn"
            :class="{ active: lastSolve.penalty === '+2' }"
            @click="store.setPenalty(lastSolveIndex, '+2')"
          >
            +2
          </button>
          <button
            class="quick-btn"
            :class="{ active: lastSolve.penalty === 'DNF' }"
            @click="store.setPenalty(lastSolveIndex, 'DNF')"
          >
            DNF
          </button>
        </div>
      </div>

      <div class="bottom-row">
        <div class="net-panel">
          <CubeNet :facelets="facelets" />
        </div>

        <div class="stats-slot">
          <StatsPanel />
        </div>
      </div>
    </PageSection>

    <TimerHistory />
  </div>
</template>

<style scoped>
.practice {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  align-items: center;
  justify-items: center;
  min-height: 680px;
}
.scramble-slot {
  align-self: start;
  margin-top: 4rem;
  width: 100%;
}
.timer-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 48px 0;
}
.timer-touch-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  /* Large tap-and-hold target for touch/pen — see useHoldTimerInput. Blocks the
     browser's own touch gestures (scroll, double-tap zoom, text selection) so a
     hold isn't interrupted or misread as a page gesture. */
  touch-action: none;
  user-select: none;
}
.timer-display {
  font-family: var(--font-mono);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: clamp(2.2rem, 6vw, 3rem);
}
.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}
.quick-btn {
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: 6px;
  font-size: 0.75rem;
  padding: 8px 14px;
}
.quick-btn:hover {
  color: var(--text);
  border-color: var(--accent-dim);
}
.quick-btn.active {
  color: var(--amber);
  border-color: var(--amber);
}
.hint {
  color: var(--muted);
  font-size: 0.82rem;
  margin: 0;
}
.swipe-hint {
  color: var(--accent-dim);
  font-size: 0.72rem;
  margin: 2px 0 0;
}
.bottom-row {
  align-self: start;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 48px;
  align-items: stretch;
  width: 100%;
  margin-top: 48px;
}
.net-panel {
  width: 100%;
  max-width: 220px;
  aspect-ratio: 144 / 106;
}
.stats-slot {
  justify-self: end;
  width: 100%;
  max-width: 320px;
}

@media (max-width: 560px) {
  .practice {
    min-height: 0;
    grid-template-rows: auto auto auto;
  }
}

@media (max-width: 480px) {
  .bottom-row {
    gap: 16px;
  }
  .net-panel {
    max-width: 150px;
  }
}
</style>
