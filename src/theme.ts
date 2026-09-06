import { LOCAL_STORAGE_KEYS } from '@/constants'
import { loadJson, saveJson } from '@/lib/storage'
import type { Theme } from '@/types'
import { ref } from 'vue'

function detectInitialTheme(): Theme {
  const stored = loadJson<Theme | null>(LOCAL_STORAGE_KEYS.THEME_STORAGE_KEY, null)
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
  saveJson(LOCAL_STORAGE_KEYS.THEME_STORAGE_KEY, t)
}

applyTheme(theme.value)
