import { ref } from 'vue'

/**
 * Whether the user's most recent input was touch/pen rather than a keyboard —
 * a single app-wide signal (not per-component state), since it should stay in
 * sync no matter which view first noticed it, and shouldn't cost a new set of
 * global listeners every time a component mounts. Seeded from
 * `matchMedia('(pointer: coarse)')` (the device's primary pointer) and then
 * kept live by whichever actually happens first — a touch/pen pointer, or a
 * keypress — so a 2-in-1 laptop that switches between touch and a physical
 * keyboard updates instead of staying stuck on its initial guess.
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

/** Reactive `{ isTouch }` reflecting the user's current input method — see the `isTouch` doc comment above. */
export function useInputMethod() {
  startListening()
  return { isTouch }
}
