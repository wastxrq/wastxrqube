<script setup lang="ts">
import { ChevronIcon } from '@/components/icons'
import { LOCAL_STORAGE_KEYS } from '@/constants'
import type { Locale } from '@/i18n'
import { saveJson } from '@/lib/storage'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

const { locale } = useI18n()
const open = ref(false)
const root = ref<HTMLElement>()

const currentLabel = computed(() => LOCALES.find((l) => l.code === locale.value)?.label ?? '')

function select(code: Locale) {
  locale.value = code
  saveJson(LOCAL_STORAGE_KEYS.LOCALE_STORAGE_KEY, code)
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => window.addEventListener('click', onClickOutside))
onUnmounted(() => window.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="root" class="language-switcher" :class="{ open }">
    <button class="lang-trigger" type="button" @click="open = !open">
      {{ currentLabel }}
      <ChevronIcon class="chev" />
    </button>
    <div v-if="open" class="lang-menu">
      <button
        v-for="l in LOCALES"
        :key="l.code"
        class="lang-option"
        :class="{ active: l.code === locale }"
        type="button"
        @click="select(l.code)"
      >
        {{ l.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: flex;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
}
.lang-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--panel-2);
  border: none;
  color: var(--accent);
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 0.92rem;
  font-weight: 500;
  font-family: var(--font-body);
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.chev {
  color: var(--muted);
  flex-shrink: 0;
  transition: transform 0.15s;
}
.language-switcher.open .chev {
  transform: rotate(180deg);
}
.lang-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 100%;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.lang-option {
  background: none;
  border: none;
  color: var(--muted);
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 0.92rem;
  font-weight: 500;
  font-family: var(--font-body);
  text-align: left;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.lang-option:hover {
  color: var(--text);
  background: var(--panel-2);
}
.lang-option.active {
  background: var(--panel-2);
  color: var(--accent);
}

@media (max-width: 560px) {
  .lang-trigger {
    gap: 4px;
    padding: 8px 10px;
    font-size: 0.82rem;
  }
}
</style>
