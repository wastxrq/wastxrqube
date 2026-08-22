<script setup lang="ts">
import { CubeNet, StatsPanel, TimerHistory } from '@/components'
import { RefreshIcon } from '@/components/icons'
import { useDeleteHotkey, useHoldTimer } from '@/composables'
import { INSPECTION_MS } from '@/constants'
import { randomScramble, scrambledFacelets } from '@/cube'
import { effectiveTime, formatTime } from '@/lib'
import { useTimerSessionsStore } from '@/stores'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const store = useTimerSessionsStore()
const scramble = ref(randomScramble())
const facelets = computed(() => scrambledFacelets(scramble.value))

const timer = useHoldTimer({
  inspectionMs: INSPECTION_MS,
  onComplete: (ms, penalty) => {
    store.addSolve(ms, scramble.value, penalty)
    scramble.value = randomScramble()
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
  Math.max(0, Math.ceil((INSPECTION_MS - timer.inspectionElapsed.value) / 1000)),
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

const hintText = computed(() =>
  timer.state.value === 'inspecting'
    ? "Space — почати розв'язання"
    : "Space — старт/стоп · Delete/Backspace — видалити останній розв'язок",
)

function newScramble() {
  scramble.value = randomScramble()
}

useDeleteHotkey({
  enabled: () => timer.state.value !== 'running' && store.solves.length > 0,
  onDelete: () => store.deleteSolve(store.solves.length - 1),
})

function onWindowKeydown(e: KeyboardEvent) {
  if (e.code !== 'Space') return

  if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement | null)?.tagName ?? ''))
    return
  e.preventDefault()
  timer.press()
}

function onWindowKeyup(e: KeyboardEvent) {
  if (e.code !== 'Space') return
  e.preventDefault()
  timer.release()
}

onMounted(() => {
  window.addEventListener('keydown', onWindowKeydown)
  window.addEventListener('keyup', onWindowKeyup)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onWindowKeydown)
  window.removeEventListener('keyup', onWindowKeyup)
})
</script>

<template>
  <div>
    <h1>Timer</h1>

    <div class="practice panel">
      <div class="scramble-row">
        <div class="scramble">{{ scramble }}</div>
        <button
          class="scramble-refresh"
          type="button"
          title="Нова розкладка"
          :disabled="timer.state.value !== 'idle'"
          @click="newScramble"
        >
          <RefreshIcon />
        </button>
      </div>

      <div class="timer-block">
        <div class="timer-display" :style="{ color: timerColor }">{{ displayText }}</div>
        <p class="hint">{{ hintText }}</p>

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
    </div>

    <TimerHistory />
  </div>
</template>

<style scoped>
.practice {
  padding: 36px 28px;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  align-items: center;
  justify-items: center;
  min-height: 680px;
  margin-bottom: 20px;
}
.scramble-row {
  align-self: start;
  margin-top: 4rem;
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
  text-align: center;
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
.timer-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 48px 0;
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
  padding: 4px 12px;
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

@media (max-width: 480px) {
  .bottom-row {
    grid-template-columns: 1fr;
    justify-items: center;
  }
  .net-panel {
    max-width: 200px;
  }
  .stats-slot {
    justify-self: center;
  }
}
</style>
