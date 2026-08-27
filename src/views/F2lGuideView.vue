<script setup lang="ts">
import { F2lCaseBrowser } from '@/components'
import { CollapsiblePanel } from '@/components/CollapsiblePanel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const links = [
  { key: 'jperm', url: 'https://jperm.net/3x3/cfop/f2l' },
  { key: 'jpermPdf', url: 'https://jperm.net/algs/f2l' },
  { key: 'jpermYoutube', url: 'https://www.youtube.com/@jperm' },
]
</script>

<template>
  <div>
    <h1>{{ t('f2l.title') }}</h1>

    <CollapsiblePanel :default-open="true" :label="t('f2l.guideLabel')">
      <div class="guide">
        <section class="intro">
          <h2>{{ t('f2l.introHeading') }}</h2>
          <p>{{ t('f2l.introBody') }}</p>
        </section>

        <section>
          <h3>{{ t('f2l.coreIdeaHeading') }}</h3>
          <p>{{ t('f2l.coreIdeaBody') }}</p>
        </section>

        <section>
          <h3>{{ t('f2l.speedHeading') }}</h3>
          <ul>
            <li>
              <strong>{{ t('f2l.speedTip1Title') }}</strong> {{ t('f2l.speedTip1Body') }}
            </li>
            <li>
              <strong>{{ t('f2l.speedTip2Title') }}</strong> {{ t('f2l.speedTip2Body') }}
            </li>
            <li>
              <strong>{{ t('f2l.speedTip3Title') }}</strong> {{ t('f2l.speedTip3Body') }}
            </li>
            <li>
              <strong>{{ t('f2l.speedTip4Title') }}</strong> {{ t('f2l.speedTip4Body') }}
            </li>
            <li>
              <strong>{{ t('f2l.speedTip5Title') }}</strong> {{ t('f2l.speedTip5Body') }}
            </li>
          </ul>
        </section>

        <section class="links">
          <h3>{{ t('f2l.resourcesHeading') }}</h3>
          <div class="link-list">
            <a
              v-for="l in links"
              :key="l.url"
              :href="l.url"
              target="_blank"
              rel="noopener"
              class="link-card"
            >
              <span class="link-title">{{ t(`f2l.resources.${l.key}.title`) }} ↗</span>
              <span class="link-note">{{ t(`f2l.resources.${l.key}.note`) }}</span>
            </a>
          </div>
        </section>
      </div>
    </CollapsiblePanel>

    <h2 class="browser-heading">{{ t('f2l.browserHeading') }}</h2>
    <F2lCaseBrowser />
  </div>
</template>

<style scoped>
.guide {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.guide section {
  padding: 6px 4px;
}
.intro p {
  color: var(--text);
  font-size: 1.02rem;
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-size: 1.4rem;
}
h3 {
  font-size: 1.05rem;
  color: var(--accent);
}
p {
  line-height: 1.6;
  color: var(--text);
  opacity: 0.92;
}
ul {
  margin: 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  line-height: 1.55;
}
li strong {
  color: var(--text);
}
.link-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.link-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  background: var(--panel-2);
  transition: border-color 0.15s ease;
}
.link-card:hover {
  border-color: var(--accent-dim);
}
.link-title {
  font-weight: 600;
  font-family: var(--font-display);
}
.link-note {
  color: var(--muted);
  font-size: 0.85rem;
}
.browser-heading {
  margin-bottom: 14px;
}
</style>
