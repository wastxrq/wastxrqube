import { THEME_STORAGE_KEY } from '@/constants'
import { loadJson, saveJson } from '@/lib/storage'
import { ref } from 'vue'

export type Theme = 'dark' | 'light'

function detectInitialTheme(): Theme {
  const stored = loadJson<Theme | null>(THEME_STORAGE_KEY, null)
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const theme = ref<Theme>(detectInitialTheme())

function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t
}

export function setTheme(t: Theme) {
  theme.value = t
  applyTheme(t)
  saveJson(THEME_STORAGE_KEY, t)
}

applyTheme(theme.value)
