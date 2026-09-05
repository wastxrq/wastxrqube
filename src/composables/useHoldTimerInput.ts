import { TIMER_CONSTANTS } from '@/constants'
import type { UseHoldTimerInputOptions } from '@/types'
import { onMounted, onUnmounted } from 'vue'
import type { useHoldTimer } from './useHoldTimer'

/**
 * Wires a useHoldTimer instance to both the Space bar and a touch/pen hold
 * gesture, shared by TimerView/OllTrainerView/PllTrainerView. Deliberately
 * ignores `pointerType === 'mouse'` — this only adds touch/pen support, not
 * a new way to start a solve with a mouse. While inspecting, also tracks a
 * left-to-right swipe as a touch equivalent of Esc (both call `onCancelKey`);
 * a no-op wherever `onCancelKey` isn't passed.
 */
export function useHoldTimerInput(
  timer: ReturnType<typeof useHoldTimer>,
  { canStart, onCancelKey }: UseHoldTimerInputOptions = {},
) {
  function tryStartHold() {
    if (timer.state.value === 'idle' && canStart && !canStart()) return
    timer.press()
  }

  function onWindowKeydown(e: KeyboardEvent) {
    if (e.code !== 'Space' && !(onCancelKey && e.key === 'Escape')) return
    if (
      ['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement | null)?.tagName ?? '')
    )
      return

    if (e.code === 'Space') {
      e.preventDefault()
      tryStartHold()
      return
    }

    // A BaseModal open at the same time swallows Escape first (capture-phase,
    // see BaseModal.vue) so this never fires underneath an open modal.
    onCancelKey?.()
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

  // Swipe-to-cancel tracking, active only while inspecting.
  let swipeStartX = 0
  let swipeStartY = 0
  let swipeTracking = false

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse') return
    e.preventDefault()
    if (onCancelKey && timer.state.value === 'inspecting') {
      swipeStartX = e.clientX
      swipeStartY = e.clientY
      swipeTracking = true
    }
    tryStartHold()
  }
  function onPointerMove(e: PointerEvent) {
    if (e.pointerType === 'mouse' || !swipeTracking) return
    // Re-checked live so a lingering finger-down after the gesture fires
    // can't re-trigger onCancelKey on a later move event.
    if (timer.state.value !== 'inspecting') {
      swipeTracking = false
      return
    }
    const dx = e.clientX - swipeStartX
    const dy = e.clientY - swipeStartY
    if (
      dx > TIMER_CONSTANTS.SWIPE_CANCEL_THRESHOLD_PX &&
      dx > Math.abs(dy) * TIMER_CONSTANTS.SWIPE_CANCEL_HORIZONTAL_RATIO
    ) {
      swipeTracking = false
      onCancelKey?.()
    }
  }
  function onPointerUp(e: PointerEvent) {
    if (e.pointerType === 'mouse') return
    e.preventDefault()
    swipeTracking = false
    timer.release()
  }
  function onPointerCancel(e: PointerEvent) {
    if (e.pointerType === 'mouse') return
    swipeTracking = false
    timer.release()
  }

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
}
