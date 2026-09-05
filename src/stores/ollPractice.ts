import { LOCAL_STORAGE_KEYS, RECENT_MEAN_WINDOW, TIMER_CONSTANTS } from '@/constants'
import { scrambleForAlg } from '@/cube/engine'
import { ollCases, ollGroups } from '@/data/oll'
import { loadJson, saveJson } from '@/lib/storage'
import type { CaseAttempt, CaseStats } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useOllPracticeStore = defineStore('ollPractice', () => {
  const selectedCases = ref<number[]>(
    loadJson(LOCAL_STORAGE_KEYS.OLL_SELECTION_STORAGE_KEY, [31, 32]),
  )
  const history = ref<CaseAttempt<number>[]>(
    loadJson(LOCAL_STORAGE_KEYS.OLL_HISTORY_STORAGE_KEY, []),
  )
  const currentCaseId = ref<number | null>(null)
  const currentScramble = ref('')
  // Fixed at startRecap() time, not reactive to later selectedCases changes —
  // toggling a case mid-pass can't mutate the queue out from under you.
  const recapQueue = ref<number[]>([])
  const lastRecapAt = ref<number | null>(null)
  const storeInitAt = Date.now()

  watch(selectedCases, (v) => saveJson(LOCAL_STORAGE_KEYS.OLL_SELECTION_STORAGE_KEY, v), {
    deep: true,
  })
  watch(history, (v) => saveJson(LOCAL_STORAGE_KEYS.OLL_HISTORY_STORAGE_KEY, v), { deep: true })

  const mode = computed<'practice' | 'recap'>(() =>
    recapQueue.value.length > 0 ? 'recap' : 'practice',
  )

  function isSelected(id: number) {
    return selectedCases.value.includes(id)
  }

  function selectedCountInGroup(group: { cases: number[] }) {
    return group.cases.filter((id) => selectedCases.value.includes(id)).length
  }

  function toggleCase(id: number) {
    const idx = selectedCases.value.indexOf(id)
    if (idx !== -1) selectedCases.value.splice(idx, 1)
    else selectedCases.value.push(id)
  }

  function toggleGroup(name: string) {
    const group = ollGroups.find((g) => g.name === name)
    if (!group) return
    const removing = selectedCountInGroup(group) > 0
    for (const id of group.cases) {
      const idx = selectedCases.value.indexOf(id)
      if (removing) {
        if (idx !== -1) selectedCases.value.splice(idx, 1)
      } else if (idx === -1) {
        selectedCases.value.push(id)
      }
    }
  }

  function clearSelection() {
    selectedCases.value = []
  }

  function pickNext() {
    if (recapQueue.value.length > 0) {
      const idx = Math.floor(Math.random() * recapQueue.value.length)
      currentCaseId.value = recapQueue.value[idx]!
      recapQueue.value.splice(idx, 1)
    } else {
      const pool = selectedCases.value.filter((id) => id !== currentCaseId.value)
      const from = pool.length ? pool : selectedCases.value
      currentCaseId.value = from.length ? from[Math.floor(Math.random() * from.length)]! : null
    }
    currentScramble.value =
      currentCaseId.value !== null ? scrambleForAlg(ollCases[currentCaseId.value]!.algs[0]!) : ''
  }

  function logAttempt(ms: number | null) {
    if (currentCaseId.value === null) return
    history.value.push({ caseId: currentCaseId.value, ms, timestamp: Date.now() })
    if (history.value.length > LOCAL_STORAGE_KEYS.OLL_HISTORY_LIMIT) {
      history.value.splice(0, history.value.length - LOCAL_STORAGE_KEYS.OLL_HISTORY_LIMIT)
    }
    pickNext()
  }

  function removeLastAttempt() {
    history.value.pop()
  }

  /** Average ms for a case from attempts strictly before the given timestamp (baseline for "slow" detection). */
  function caseAverageBefore(caseId: number, beforeTimestamp: number): number | null {
    const times = history.value
      .filter((a) => a.caseId === caseId && a.ms !== null && a.timestamp < beforeTimestamp)
      .map((a) => a.ms as number)
    if (!times.length) return null
    return times.reduce((a, b) => a + b, 0) / times.length
  }

  /** Case IDs, since the last recap, that were skipped or came in slow relative to their own baseline. */
  function recapCandidates(): Set<number> {
    const since = lastRecapAt.value ?? storeInitAt
    const flagged = new Set<number>()
    for (const attempt of history.value) {
      if (attempt.timestamp <= since || !selectedCases.value.includes(attempt.caseId)) continue
      if (attempt.ms === null) {
        flagged.add(attempt.caseId)
        continue
      }
      const avg = caseAverageBefore(attempt.caseId, attempt.timestamp)
      if (avg !== null && attempt.ms > avg * TIMER_CONSTANTS.SLOW_THRESHOLD_FACTOR)
        flagged.add(attempt.caseId)
    }
    return flagged
  }

  const recapCandidateCount = computed(() => recapCandidates().size)

  function startRecap() {
    const flagged = recapCandidates()
    lastRecapAt.value = Date.now()
    if (!flagged.size) return
    recapQueue.value = [...flagged]
    pickNext()
  }

  function exitRecap() {
    recapQueue.value = []
    pickNext()
  }

  const solvedCount = computed(() => history.value.filter((a) => a.ms !== null).length)

  const best = computed(() => {
    const times = history.value
      .filter((a): a is CaseAttempt<number> & { ms: number } => a.ms !== null)
      .map((a) => a.ms)
    return times.length ? Math.min(...times) : null
  })

  const recentMean = computed(() => {
    const times = history.value
      .filter((a): a is CaseAttempt<number> & { ms: number } => a.ms !== null)
      .map((a) => a.ms)
      .slice(-RECENT_MEAN_WINDOW)
    if (!times.length) return null
    return times.reduce((a, b) => a + b, 0) / times.length
  })

  // Most-recently-practiced case first; each case's own times stay in the order they were solved.
  const statsByCase = computed<CaseStats<number>[]>(() => {
    const order: number[] = []
    const seen = new Set<number>()
    for (let i = history.value.length - 1; i >= 0; i--) {
      const attempt = history.value[i]!
      if (attempt.ms === null || !selectedCases.value.includes(attempt.caseId)) continue
      if (!seen.has(attempt.caseId)) {
        seen.add(attempt.caseId)
        order.push(attempt.caseId)
      }
    }
    return order.map((caseId) => {
      const times = history.value
        .filter(
          (a): a is CaseAttempt<number> & { ms: number } => a.caseId === caseId && a.ms !== null,
        )
        .map((a) => a.ms)
      return {
        caseId,
        name: ollCases[caseId]!.name,
        mean: times.reduce((a, b) => a + b, 0) / times.length,
        times,
      }
    })
  })

  return {
    selectedCases,
    history,
    currentCaseId,
    currentScramble,
    recapQueue,
    mode,
    isSelected,
    selectedCountInGroup,
    toggleCase,
    toggleGroup,
    clearSelection,
    pickNext,
    logAttempt,
    removeLastAttempt,
    recapCandidateCount,
    startRecap,
    exitRecap,
    solvedCount,
    best,
    recentMean,
    statsByCase,
  }
})
