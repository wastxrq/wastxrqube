import { ref } from 'vue'

/**
 * Whether the user's most recent input was touch/pen rather than a keyboard —
 * a single app-wide signal, not per-component state, so it stays in sync
 * without a new set of global listeners per mount. Seeded from
 * `matchMedia('(pointer: coarse)')`, then kept live by whichever actually
 * happens first, so a 2-in-1 laptop updates instead of sticking to its guess.
 */
const isTouch = ref(matchesCoarsePointer())

function matchesCoarsePointer(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
}

let listening = false

function startListening() {
  if (listening || typeof window === 'undefined') return
  listening = true

  window.addEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') isTouch.value = true
    },
    { passive: true },
  )
  window.addEventListener('keydown', () => {
    isTouch.value = false
  })

  const mql = typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)') : null
  mql?.addEventListener('change', (e) => {
    isTouch.value = e.matches
  })
}

/** Reactive `{ isTouch }` reflecting the user's current input method. */
export function useInputMethod() {
  startListening()
  return { isTouch }
}
