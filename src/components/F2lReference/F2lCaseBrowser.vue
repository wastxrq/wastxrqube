<script setup lang="ts">
import { CollapsiblePanel } from '@/components/CollapsiblePanel'
import { caseFaceletsForAlg } from '@/cube/engine'
import { f2lCases, f2lGroups } from '@/data/f2l'
import { pluralCases } from '@/lib/pluralize'
import F2lReferenceCard from './F2lReferenceCard.vue'

const totalCases = Object.keys(f2lCases).length
</script>

<template>
  <CollapsiblePanel
    :default-open="false"
    :count="totalCases"
    :label="`${pluralCases(totalCases)} F2L`"
  >
    <div class="groups">
      <div v-for="group in f2lGroups" :key="group.name" class="group">
        <div class="group-head">{{ group.name }}</div>
        <div class="cards">
          <F2lReferenceCard
            v-for="id in group.cases"
            :key="id"
            :name="f2lCases[id]!.name"
            :algorithm="f2lCases[id]!.algs[0]!"
            :facelets="caseFaceletsForAlg(f2lCases[id]!.algs[0]!)"
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
