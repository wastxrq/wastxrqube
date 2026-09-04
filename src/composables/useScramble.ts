import { generateScramble } from '@/lib/scramble'
import type { ScrambleEvent } from '@/types'
import { ref } from 'vue'

/**
 * Reactive wrapper around lib/scramble.ts's WCA-style random-state scrambler.
 * Generates one scramble immediately on creation; call `generate()` again to
 * replace it (e.g. a manual "new scramble" click, or after a solve completes).
 * `isLoading` is true for the whole in-flight duration — callers should gate
 * starting a solve on it rather than assume `scramble` is populated
 * synchronously, since generation isn't instant (see lib/scramble.ts).
 */
export function useScramble(event: ScrambleEvent = '333') {
  const scramble = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function generate() {
    isLoading.value = true
    error.value = null
    try {
      scramble.value = await generateScramble(event)
    } catch (e) {
      error.value = 'Failed to generate scramble'
      console.error('[useScramble] scramble generation failed', e)
    } finally {
      isLoading.value = false
    }
  }

  generate()

  return { scramble, isLoading, error, generate }
}
