<script setup lang="ts">
import { CubeNet, StatsPanel, TimerHistory } from '@/components'
import { useHoldTimer } from '@/composables'
import { randomScramble, scrambledFacelets } from '@/cube'
import { effectiveTime, formatTime } from '@/lib'
import { useTimerSessionsStore } from '@/stores'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const store = useTimerSessionsStore()
const scramble = ref(randomScramble())
const facelets = computed(() => scrambledFacelets(scramble.value))

const timer = useHoldTimer({
  onComplete: (ms) => {
    store.addSolve(ms, scramble.value)
    scramble.value = randomScramble()
  },
})

const timerColor = computed(() => {
  if (timer.state.value === 'holding') return 'var(--danger)'
  if (timer.state.value === 'ready') return 'var(--accent)'
  return 'var(--text)'
})

// While idle, keep showing the last result (with any penalty applied) rather than resetting to 0.00 —
// derived from the store so editing the last solve's penalty in the history list stays in sync here too.
const lastSolve = computed(() => store.solves[store.solves.length - 1])
const shownMs = computed(() => {
  if (timer.state.value !== 'idle') return timer.elapsed.value
  return lastSolve.value ? effectiveTime(lastSolve.value) : 0
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
      <div class="scramble">{{ scramble }}</div>

      <div class="timer-block">
        <div class="timer-display" :style="{ color: timerColor }">{{ formatTime(shownMs) }}</div>
        <p class="hint">Space — старт/стоп</p>
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
.scramble {
  align-self: start;
  margin-top: 4rem;
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: center;
  width: 100%;
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
