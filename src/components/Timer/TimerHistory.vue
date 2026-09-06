<script setup lang="ts">
import { AppButton, CollapsiblePanel, PenaltyToggle } from '@/components'
import { useInputMethod } from '@/composables'
import { effectiveTime, formatTime, pluralizeUk } from '@/lib'
import { useTimerSessionsStore } from '@/stores'
import type { Solve } from '@/types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SolveDetailModal from './SolveDetailModal.vue'

const { isTouch } = useInputMethod()

const store = useTimerSessionsStore()
const { t } = useI18n()
const newSessionName = ref('')
const addingSession = ref(false)
const selectedSolve = ref<Solve | null>(null)

const solvesLabel = computed(() =>
  pluralizeUk(store.solves.length, [
    t('common.plural.solve.one'),
    t('common.plural.solve.few'),
    t('common.plural.solve.many'),
  ]),
)

function submitNewSession() {
  if (!newSessionName.value.trim()) return
  store.addSession(newSessionName.value)
  newSessionName.value = ''
  addingSession.value = false
}
</script>

<template>
  <CollapsiblePanel
    :default-open="false"
    :count="store.solves.length"
    :label="`${solvesLabel} · ${store.activeSessionName}`"
  >
    <div class="sessions">
      <div
        v-for="session in store.sessions"
        :key="session.name"
        class="session-pill"
        :class="{ active: session.name === store.activeSessionName }"
      >
        <button class="session-name" @click="store.switchSession(session.name)">
          {{ session.name }}
          <span class="pill-count">{{ session.solves.length }}</span>
        </button>
        <button
          v-if="store.sessions.length > 1"
          class="pill-delete"
          :title="t('timerHistory.deleteSessionTitle')"
          @click="store.deleteSession(session.name)"
        >
          ✕
        </button>
      </div>

      <button v-if="!addingSession" class="session-pill add" @click="addingSession = true">
        +
      </button>
      <div v-else class="session-add">
        <input
          v-model="newSessionName"
          :placeholder="t('timerHistory.sessionNamePlaceholder')"
          autofocus
          @keyup.enter="submitNewSession"
          @keyup.esc="addingSession = false"
        />
        <AppButton @click="submitNewSession">{{ t('timerHistory.addButton') }}</AppButton>
      </div>
    </div>

    <p v-if="store.solves.length === 0" class="hint">
      {{ t('timerHistory.emptyState') }}
    </p>
    <div v-else class="solve-list">
      <div
        v-for="(solve, i) in [...store.solves].reverse()"
        :key="solve.date"
        class="solve-row"
        :class="{ 'is-touch': isTouch }"
        @click="selectedSolve = solve"
      >
        <span class="solve-idx">{{ store.solves.length - i }}</span>
        <span class="solve-time" :class="{ dnf: solve.penalty === 'DNF' }">
          {{ formatTime(effectiveTime(solve)) }}
        </span>
        <span v-if="solve.penalty !== 'none'" class="solve-penalty">{{ solve.penalty }}</span>
        <div class="solve-actions">
          <PenaltyToggle
            :penalty="solve.penalty"
            stop-propagation
            @set-penalty="store.setPenalty(store.solves.length - 1 - i, $event)"
          />
          <button @click.stop="store.deleteSolve(store.solves.length - 1 - i)">✕</button>
        </div>
      </div>
    </div>
  </CollapsiblePanel>

  <SolveDetailModal :solve="selectedSolve" @close="selectedSolve = null" />
</template>

<style scoped>
.sessions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.session-pill {
  display: flex;
  align-items: stretch;
  background: var(--panel-2);
  border: 1.5px solid var(--border);
  border-radius: 999px;
  overflow: hidden;
}
.session-pill.active {
  border-color: var(--accent);
}
.session-name {
  background: none;
  border: none;
  color: var(--muted);
  font-family: var(--font-body);
  font-size: 0.85rem;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.session-pill.active .session-name {
  color: var(--accent);
}
.pill-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
}
.pill-delete {
  background: none;
  border: none;
  border-left: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.7rem;
  padding: 0 10px;
}
.pill-delete:hover {
  color: var(--danger);
}
.session-pill.add {
  background: none;
  border: 1.5px dashed var(--border);
  color: var(--muted);
  padding: 6px 14px;
  font-size: 0.9rem;
}
.session-pill.add:hover {
  color: var(--text);
  border-color: var(--accent-dim);
}
.session-add {
  display: flex;
  gap: 6px;
}
.session-add input {
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  padding: 6px 14px;
  font-size: 0.85rem;
  min-width: 140px;
}

.hint {
  color: var(--muted);
  font-size: 0.82rem;
  margin: 0;
}
.solve-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 420px;
  overflow-y: auto;
}
.solve-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  cursor: pointer;
}
.solve-row:hover {
  background: var(--panel-2);
}
.solve-row:hover .solve-actions,
/* No :hover on touch, so these quick actions (a shortcut past opening the
   detail modal — tapping the row still works too) stay visible outright. */
.solve-row.is-touch .solve-actions {
  display: flex;
}
.solve-idx {
  color: var(--muted);
  width: 26px;
  flex-shrink: 0;
}
.solve-time.dnf {
  color: var(--danger);
}
.solve-penalty {
  color: var(--amber);
  font-size: 0.72rem;
}
.solve-actions {
  display: none;
  gap: 4px;
  margin-left: auto;
}
.solve-actions button {
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: 4px;
  font-size: 0.7rem;
  padding: 2px 7px;
}
.solve-row.is-touch .solve-actions button {
  padding: 6px 10px;
}
.solve-actions button:hover {
  color: var(--text);
  border-color: var(--accent-dim);
}
</style>
