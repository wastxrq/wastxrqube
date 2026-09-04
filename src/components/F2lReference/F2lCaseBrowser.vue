<script setup lang="ts">
import { CollapsiblePanel } from '@/components/CollapsiblePanel'
import { f2lCases, f2lGroups } from '@/data/f2l'
import { pluralizeUk } from '@/lib/pluralize'
import { f2lCaseDisplayFacelets } from '@/utils'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import F2lReferenceCard from './F2lReferenceCard.vue'

const { t } = useI18n()
const totalCases = Object.keys(f2lCases).length

const label = computed(
  () =>
    `${pluralizeUk(totalCases, [
      t('common.plural.case.one'),
      t('common.plural.case.few'),
      t('common.plural.case.many'),
    ])} ${t('f2lBrowser.labelSuffix')}`,
)
</script>

<template>
  <CollapsiblePanel :default-open="false" :count="totalCases" :label="label">
    <div class="groups">
      <div v-for="group in f2lGroups" :key="group.labelKey" class="group">
        <div class="group-head">{{ t(group.labelKey) }}</div>
        <div class="cards">
          <F2lReferenceCard
            v-for="id in group.cases"
            :key="id"
            :name="f2lCases[id]!.name"
            :algorithm="f2lCases[id]!.algs[0]!"
            :facelets="f2lCaseDisplayFacelets(f2lCases[id]!.algs[0]!)"
          />
        </div>
      </div>
    </div>
  </CollapsiblePanel>
</template>

<style scoped>
.groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.group-head {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  color: var(--muted);
  padding: 6px 2px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
}
</style>
