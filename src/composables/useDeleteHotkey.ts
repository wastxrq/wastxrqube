import type { UseDeleteHotkeyOptions } from '@/types'
import { onMounted, onUnmounted } from 'vue'

/**
 * Delete/Backspace hotkey (Backspace covers Mac laptop keyboards, whose "delete"
 * key sends Backspace, not Delete), guarded against key-repeat and against
 * firing while focus is in a text input/textarea.
 */
export function useDeleteHotkey({ enabled, onDelete }: UseDeleteHotkeyOptions) {
  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return
    if (
      ['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement | null)?.tagName ?? '')
    )
      return
    if (e.repeat || !enabled()) return
    e.preventDefault()
    onDelete()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
