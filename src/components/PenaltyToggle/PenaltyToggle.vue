<script setup lang="ts">
import { AppButton } from '@/components'
import type { SolvePenalty } from '@/types'

withDefaults(
  defineProps<{
    penalty: SolvePenalty
    /** Class applied to each plain <button> — ignored when `appButton` is set (AppButton owns its own classes). */
    buttonClass?: string
    /** Renders each toggle as AppButton instead of a plain <button> — matches SolveDetailModal's other actions. */
    appButton?: boolean
    /** Highlights whichever penalty is currently set — TimerHistory's compact row omits this. */
    showActive?: boolean
    /** TimerHistory's own row has a click handler these toggles must not bubble into; the other two contexts don't need this. */
    stopPropagation?: boolean
  }>(),
  { appButton: false, showActive: false, stopPropagation: false },
)

const emit = defineEmits<{ setPenalty: [penalty: '+2' | 'DNF'] }>()

function toggle(e: MouseEvent, value: '+2' | 'DNF', stop: boolean) {
  if (stop) e.stopPropagation()
  emit('setPenalty', value)
}
</script>

<template>
  <template v-if="appButton">
    <AppButton
      :class="{ active: showActive && penalty === '+2' }"
      @click="toggle($event, '+2', stopPropagation)"
    >
      +2
    </AppButton>
    <AppButton
      :class="{ active: showActive && penalty === 'DNF' }"
      @click="toggle($event, 'DNF', stopPropagation)"
    >
      DNF
    </AppButton>
  </template>
  <template v-else>
    <button
      :class="[buttonClass, { active: showActive && penalty === '+2' }]"
      @click="toggle($event, '+2', stopPropagation)"
    >
      +2
    </button>
    <button
      :class="[buttonClass, { active: showActive && penalty === 'DNF' }]"
      @click="toggle($event, 'DNF', stopPropagation)"
    >
      DNF
    </button>
  </template>
</template>
