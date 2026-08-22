import {
  DEFAULT_HOLD_MS,
  INSPECTION_DNF_THRESHOLD_MS,
  INSPECTION_PLUS_TWO_THRESHOLD_MS,
} from '@/constants'
import type { SolvePenalty, TimerState, UseHoldTimerOptions } from '@/types'
import { ref } from 'vue'

function inspectionPenalty(inspectionMs: number): SolvePenalty {
  if (inspectionMs > INSPECTION_DNF_THRESHOLD_MS) return 'DNF'
  if (inspectionMs > INSPECTION_PLUS_TWO_THRESHOLD_MS) return '+2'
  return 'none'
}

/**
 * Hold-to-start timer state machine, cstimer/stackmat style.
 * States: idle -> holding (press+wait) -> ready (green, release to start)
 *         -> [inspecting (press+wait+release again), only if inspectionMs is set] ->
 *         running -> idle (press again, or release after start, to stop)
 *
 * When inspectionMs is set, `armed` turns true once the second hold (during
 * inspecting) clears holdMs — release only starts the solve once armed.
 */
export function useHoldTimer({
  holdMs = DEFAULT_HOLD_MS,
  inspectionMs,
  onComplete,
}: UseHoldTimerOptions = {}) {
  const state = ref<TimerState>('idle')
  const elapsed = ref(0)
  const inspectionElapsed = ref(0)
  const armed = ref(false)

  let startTime = 0
  let inspectionStartTime = 0
  let holdTimer: ReturnType<typeof setTimeout> | null = null
  let rafId = 0
  let inspectionRafId = 0
  let pointerDown = false

  function tick() {
    elapsed.value = performance.now() - startTime
    rafId = requestAnimationFrame(tick)
  }

  function inspectionTick() {
    inspectionElapsed.value = performance.now() - inspectionStartTime
    inspectionRafId = requestAnimationFrame(inspectionTick)
  }

  function startRunning() {
    state.value = 'running'
    startTime = performance.now()
    tick()
  }

  function press() {
    if (pointerDown) return
    pointerDown = true

    if (state.value === 'running') {
      stop()
      return
    }
    if (state.value === 'idle') {
      state.value = 'holding'
      elapsed.value = 0
      holdTimer = setTimeout(() => {
        if (state.value === 'holding') state.value = 'ready'
      }, holdMs)
      return
    }
    if (state.value === 'inspecting') {
      holdTimer = setTimeout(() => {
        if (state.value === 'inspecting' && pointerDown) armed.value = true
      }, holdMs)
    }
  }

  function release() {
    pointerDown = false

    if (state.value === 'holding') {
      if (holdTimer) clearTimeout(holdTimer)
      state.value = 'idle'
      return
    }
    if (state.value === 'ready') {
      if (inspectionMs) {
        state.value = 'inspecting'
        inspectionStartTime = performance.now()
        inspectionElapsed.value = 0
        inspectionTick()
      } else {
        startRunning()
      }
      return
    }
    if (state.value === 'inspecting') {
      if (holdTimer) clearTimeout(holdTimer)
      // Released before the second hold cleared holdMs — treat as an accidental tap, keep inspecting.
      if (!armed.value) return
      cancelAnimationFrame(inspectionRafId)
      armed.value = false
      startRunning()
    }
  }

  function stop() {
    cancelAnimationFrame(rafId)
    const final = performance.now() - startTime
    elapsed.value = final
    state.value = 'idle'
    if (onComplete) onComplete(Math.round(final), inspectionPenalty(inspectionElapsed.value))
  }

  function reset() {
    cancelAnimationFrame(rafId)
    cancelAnimationFrame(inspectionRafId)
    if (holdTimer) clearTimeout(holdTimer)
    state.value = 'idle'
    elapsed.value = 0
    inspectionElapsed.value = 0
    armed.value = false
    pointerDown = false
  }

  return { state, elapsed, inspectionElapsed, armed, press, release, reset }
}
