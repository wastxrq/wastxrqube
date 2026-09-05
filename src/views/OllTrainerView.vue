<script setup lang="ts">
import {
  AppButton,
  OllCaseDiagram,
  OllCaseSelector,
  OllCaseStats,
  PageSection,
  ScrambleRow,
} from '@/components'
import { useDeleteHotkey, useHoldTimer, useHoldTimerInput, useInputMethod } from '@/composables'
import { TIMER_CONSTANTS } from '@/constants'
import { caseFaceletsForAlg } from '@/cube'
import { ollCases } from '@/data/oll'
import { formatTime, pluralizeUk } from '@/lib'
import { useOllPracticeStore } from '@/stores'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const store = useOllPracticeStore()
const { t } = useI18n()
const { isTouch } = useInputMethod()

const recapWord = computed(() =>
  pluralizeUk(store.recapQueue.length, [
    t('common.plural.case.one'),
    t('common.plural.case.few'),
    t('common.plural.case.many'),
  ]),
)

const hasSelection = computed(() => store.selectedCases.length > 0)
const currentCase = computed(() =>
  store.currentCaseId !== null ? ollCases[store.currentCaseId] : null,
)
const currentFacelets = computed(() =>
  currentCase.value ? caseFaceletsForAlg(currentCase.value.algs[0]!) : '',
)

const revealed = ref(false)

function ensureCurrentCase() {
  if (store.currentCaseId === null && store.selectedCases.length > 0) store.pickNext()
}
watch(() => store.selectedCases.length, ensureCurrentCase)

const timer = useHoldTimer({
  onComplete: (ms) => {
    setTimeout(() => {
      store.logAttempt(ms)
      revealed.value = false
      timer.reset()
    }, TIMER_CONSTANTS.RESULT_DISPLAY_DELAY_MS)
  },
})

function skip() {
  store.logAttempt(null)
  revealed.value = false
  timer.reset()
}

function exitRecap() {
  store.exitRecap()
  revealed.value = false
  timer.reset()
}

const timerColor = computed(() => {
  if (timer.state.value === 'holding') return 'var(--danger)'
  if (timer.state.value === 'ready') return 'var(--accent)'
  return 'var(--text)'
})

useDeleteHotkey({
  enabled: () => timer.state.value !== 'running',
  onDelete: () => store.removeLastAttempt(),
})

const { onPointerDown, onPointerUp, onPointerCancel } = useHoldTimerInput(timer, {
  canStart: () => hasSelection.value,
})

const hintText = computed(() => (isTouch.value ? t('oll.hintTouch') : t('oll.hint')))

onMounted(() => {
  ensureCurrentCase()
})
</script>

<template>
  <div>
    <h1>{{ t('oll.title') }}</h1>

    <OllCaseSelector />

    <PageSection class="practice">
      <div v-if="store.mode === 'recap'" class="recap-banner">
        <span>{{ t('oll.recapBanner', { n: store.recapQueue.length, word: recapWord }) }}</span>
        <AppButton @click="exitRecap">{{ t('oll.exitRecap') }}</AppButton>
      </div>

      <template v-if="hasSelection && currentCase">
        <ScrambleRow class="scramble-slot" :scramble="store.currentScramble" />

        <div class="main-diagram">
          <OllCaseDiagram :facelets="currentFacelets" :size="180" />
        </div>

        <div class="case-id">OLL {{ store.currentCaseId }}</div>
        <div class="case-name">{{ currentCase.name }}</div>

        <div
          class="timer-touch-zone"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
        >
          <div class="timer-display" :style="{ color: timerColor }">
            {{ formatTime(timer.elapsed.value) }}
          </div>
          <p class="hint">{{ hintText }}</p>
        </div>

        <div class="practice-actions">
          <AppButton @click="revealed = !revealed">
            {{ revealed ? t('oll.hideAlg') : t('oll.showAlg') }}
          </AppButton>
          <AppButton @click="skip">{{ t('oll.skip') }}</AppButton>
          <AppButton :disabled="timer.state.value === 'running'" @click="store.removeLastAttempt()">
            {{ t('oll.undoButton') }}
          </AppButton>
        </div>
        <div v-if="revealed" class="algs">
          <code v-for="(a, i) in currentCase.algs" :key="i">{{ a }}</code>
        </div>

        <div class="stats-row">
          <div class="stat">
            <div class="label">{{ t('oll.statSolved') }}</div>
            <div class="value">{{ store.solvedCount }}</div>
          </div>
          <div class="stat">
            <div class="label">{{ t('oll.statBest') }}</div>
            <div class="value">{{ store.best !== null ? formatTime(store.best) : '–' }}</div>
          </div>
          <div class="stat">
            <div class="label">{{ t('oll.statMean') }}</div>
            <div class="value">
              {{ store.recentMean !== null ? formatTime(store.recentMean) : '–' }}
            </div>
          </div>
          <button
            v-if="store.mode === 'practice' && store.recapCandidateCount > 0"
            class="stat recap-stat"
            @click="store.startRecap()"
          >
            <div class="value">{{ t('oll.recapButton', { n: store.recapCandidateCount }) }}</div>
          </button>
        </div>
      </template>

      <p v-else class="hint empty-state">{{ t('oll.emptyState') }}</p>
    </PageSection>

    <OllCaseStats />
  </div>
</template>

<style scoped>
.practice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.empty-state {
  padding: 20px 0;
}
.recap-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 182, 72, 0.08);
  border: 1px solid rgba(255, 182, 72, 0.3);
  color: var(--amber);
  border-radius: 10px;
  padding: 9px 16px;
  margin-bottom: 14px;
  font-size: 0.82rem;
  width: 100%;
  max-width: 640px;
}
.scramble-slot {
  max-width: 480px;
  margin-bottom: 82px;
}
.case-id {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 0.85rem;
  margin-top: 6px;
}
.case-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.2rem;
}
.timer-touch-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 24px;
  /* Large tap-and-hold target for touch/pen — see useHoldTimerInput. Blocks the
     browser's own touch gestures (scroll, double-tap zoom, text selection) so a
     hold isn't interrupted or misread as a page gesture. */
  touch-action: none;
  user-select: none;
}
.timer-display {
  font-family: var(--font-mono);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: clamp(2.2rem, 6vw, 3rem);
  margin: 10px 0 4px;
}
.hint {
  color: var(--muted);
  font-size: 0.82rem;
  margin: 0;
}
.practice-actions {
  display: flex;
  gap: 10px;
  margin-top: 82px;
}
.algs {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
  align-items: center;
}
.algs code {
  font-family: var(--font-mono);
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.88rem;
}
.stats-row {
  display: flex;
  gap: 28px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
  width: 100%;
  max-width: 460px;
  justify-content: center;
  flex-wrap: wrap;
}
.stat {
  text-align: center;
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  padding: 0;
}
.stat .label {
  color: var(--muted);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat .value {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  margin-top: 2px;
}
.recap-stat {
  cursor: pointer;
  align-self: center;
}
.recap-stat .value {
  color: var(--amber);
  margin-top: 0;
}
.recap-stat:hover .value {
  color: #ffc164;
}
.main-diagram {
  width: 180px;
  height: 180px;
}

@media (max-width: 560px) {
  .scramble-slot {
    margin-bottom: 32px;
  }
  .practice-actions {
    margin-top: 32px;
  }
}
</style>
