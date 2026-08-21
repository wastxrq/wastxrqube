import { DEFAULT_HOLD_MS } from '@/constants'
import type { TimerState, UseHoldTimerOptions } from '@/types'
import { ref } from 'vue'

/**
 * Hold-to-start timer state machine, cstimer/stackmat style.
 * States: idle -> holding (press+wait) -> ready (green, release to start)
 *         -> running -> idle (press again, or release after start, to stop)
 */
export function useHoldTimer({ holdMs = DEFAULT_HOLD_MS, onComplete }: UseHoldTimerOptions = {}) {
  const state = ref<TimerState>('idle')
  const elapsed = ref(0)

  let startTime = 0
  let holdTimer: ReturnType<typeof setTimeout> | null = null
  let rafId = 0
  let pointerDown = false

  function tick() {
    elapsed.value = performance.now() - startTime
    rafId = requestAnimationFrame(tick)
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
    }
  }

  function release() {
    pointerDown = false
    if (state.value === 'holding') {
      if (holdTimer) clearTimeout(holdTimer)
      state.value = 'idle'
    } else if (state.value === 'ready') {
      state.value = 'running'
      startTime = performance.now()
      tick()
    }
  }

  function stop() {
    cancelAnimationFrame(rafId)
    const final = performance.now() - startTime
    elapsed.value = final
    state.value = 'idle'
    if (onComplete) onComplete(Math.round(final))
  }

  function reset() {
    cancelAnimationFrame(rafId)
    if (holdTimer) clearTimeout(holdTimer)
    state.value = 'idle'
    elapsed.value = 0
    pointerDown = false
  }

  return { state, elapsed, press, release, reset }
}
