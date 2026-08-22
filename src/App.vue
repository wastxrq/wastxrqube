<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { LogoBoldIcon } from '@/components/icons'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const tabs = router.options.routes
  .filter((route) => route.meta?.labelKey)
  .map((route) => ({ to: route.path, labelKey: route.meta!.labelKey! }))
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink to="/" class="brand">
        <LogoBoldIcon class="brand-mark" />
      </RouterLink>

      <div class="nav-cluster">
        <nav class="tabs">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="tab"
            active-class="tab-active"
          >
            {{ t(tab.labelKey) }}
          </RouterLink>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 1160px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 26px;
}

.brand {
  display: flex;
  align-items: center;
}
.brand-mark {
  height: 28px;
  width: auto;
  color: var(--accent);
}

.nav-cluster {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tabs {
  display: flex;
  gap: 4px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
}

.tab {
  text-decoration: none;
  color: var(--muted);
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 0.92rem;
  font-weight: 500;
  font-family: var(--font-body);
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.tab:hover {
  color: var(--text);
  background-color: transparent;
}
.tab-active {
  background: var(--panel-2);
  color: var(--accent);
}

.content {
  min-height: 60vh;
}

@media (max-width: 560px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .nav-cluster {
    width: 100%;
    flex-wrap: wrap;
  }
  .tabs {
    width: 100%;
  }
  .tab {
    flex: 1;
    text-align: center;
    padding: 8px 6px;
    font-size: 0.82rem;
  }
}
</style>
