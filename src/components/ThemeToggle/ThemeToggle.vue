<script setup lang="ts">
import { MoonIcon, SunIcon } from '@/components/icons'
import { setTheme, theme } from '@/theme'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = computed(() =>
  theme.value === 'dark' ? t('themeToggle.toLight') : t('themeToggle.toDark'),
)

function toggle() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <button class="theme-toggle" type="button" :title="title" @click="toggle">
    <SunIcon v-if="theme === 'dark'" />
    <MoonIcon v-else />
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--muted);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}
.theme-toggle:hover {
  color: var(--text);
  border-color: var(--accent-dim);
}
</style>
