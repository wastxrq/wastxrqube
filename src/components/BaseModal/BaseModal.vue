<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ open: boolean; maxWidth?: string }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()

function close() {
  emit('close')
}

// Captured (not bubbled) so this reaches window before any other page-level
// Escape handler; stopImmediatePropagation keeps it from also triggering
// whatever's underneath once it actually closes something.
function onKeydown(e: KeyboardEvent) {
  if (!props.open || e.key !== 'Escape') return
  e.stopImmediatePropagation()
  close()
}
onMounted(() => window.addEventListener('keydown', onKeydown, true))
onUnmounted(() => window.removeEventListener('keydown', onKeydown, true))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="close">
        <div class="modal panel" :style="{ maxWidth: maxWidth ?? 'clamp(360px, 46vw, 560px)' }">
          <button class="modal-close" :title="t('modal.close')" @click="close">✕</button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.modal {
  position: relative;
  width: 100%;
  padding: clamp(32px, 4vw, 48px) clamp(28px, 3.5vw, 44px) clamp(28px, 3vw, 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 0.8rem;
}
.modal-close:hover {
  color: var(--text);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>
