<script setup lang="ts">
import { AppButton } from '@/components/AppButton'
import { caseFaceletsForAlg } from '@/cube/engine'
import { pllCases, pllGroups } from '@/data/pll'
import { pluralizeUk } from '@/lib/pluralize'
import { usePllPracticeStore } from '@/stores/pllPractice'
import { CASE_CARD_MAX_SIZE_PX, CASE_CARD_MIN_SIZE_PX } from '@/constants'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CaseCard } from '../CaseCard'
import { CollapsiblePanel } from '../CollapsiblePanel'
import PllCaseDiagram from './PllCaseDiagram.vue'

const store = usePllPracticeStore()
const { t } = useI18n()
const panel = ref<InstanceType<typeof CollapsiblePanel>>()

const cardSize = `clamp(${CASE_CARD_MIN_SIZE_PX}px, 10vw, ${CASE_CARD_MAX_SIZE_PX}px)`

const selectedLabel = computed(
  () =>
    `${pluralizeUk(store.selectedCases.length, [
      t('common.plural.case.one'),
      t('common.plural.case.few'),
      t('common.plural.case.many'),
    ])} ${t('pllSelector.selectedSuffix')}`,
)

function done() {
  if (panel.value) panel.value.open = false
}
</script>

<template>
  <CollapsiblePanel
    ref="panel"
    :default-open="store.selectedCases.length === 0"
    :count="store.selectedCases.length"
    :label="selectedLabel"
  >
    <div class="groups">
      <div v-for="group in pllGroups" :key="group.name" class="group">
        <div class="group-head" @click="store.toggleGroup(group.name)">
          <span class="name">{{ group.name }}</span>
          <span class="count"
            >{{ store.selectedCountInGroup(group) }}/{{ group.cases.length }}</span
          >
        </div>
        <div class="cards">
          <CaseCard
            v-for="id in group.cases"
            :key="id"
            :title="`PLL ${id}`"
            :name="pllCases[id]!.name"
            :selected="store.isSelected(id)"
            @click="store.toggleCase(id)"
          >
            <PllCaseDiagram :facelets="caseFaceletsForAlg(pllCases[id]!.algs[0]!)" />
          </CaseCard>
        </div>
      </div>
    </div>

    <div class="selector-footer">
      <AppButton @click="store.clearSelection()">{{ t('pllSelector.clearButton') }}</AppButton>
      <AppButton variant="primary" @click="done">{{ t('pllSelector.doneButton') }}</AppButton>
    </div>
  </CollapsiblePanel>
</template>

<style scoped>
.groups {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 14px;
}
.group-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 2px;
  cursor: pointer;
}
.group-head .name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  color: var(--muted);
}
.group-head:hover .name {
  color: var(--text);
}
.group-head .count {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--muted);
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, v-bind(cardSize));
  gap: 12px;
}

.selector-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}
</style>
