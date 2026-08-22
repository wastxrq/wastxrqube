<script setup lang="ts">
import type { ButtonVariant } from '@/types'

withDefaults(defineProps<{ variant?: ButtonVariant }>(), { variant: 'ghost' })
</script>

<template>
  <button class="btn" :class="`btn-${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 8px;
  padding: 0.55em 1.1em;
  font-size: 0.92rem;
  font-weight: 500;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}
.btn:hover {
  border-color: var(--accent-dim);
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #08201b;
  font-weight: 600;
}
.btn-primary:hover {
  background: #4beed0;
}
.btn-ghost {
  background: transparent;
}
.btn-danger {
  background: rgba(255, 107, 107, 0.06);
  border-color: rgba(255, 107, 107, 0.35);
  color: var(--danger);
}
.btn-danger:hover {
  background: rgba(255, 107, 107, 0.12);
  border-color: var(--danger);
}
</style>
