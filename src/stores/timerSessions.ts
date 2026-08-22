import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  AO5_WINDOW,
  AO12_WINDOW,
  AO100_WINDOW,
  DEFAULT_SESSION_NAME,
  TIMER_SESSIONS_STORAGE_KEY,
} from '@/constants'
import { average, best, loadJson, mean, saveJson } from '@/lib'
import type { PersistedTimerState, SolvePenalty, TimerSession } from '@/types'

function defaultSessions(): TimerSession[] {
  return [{ name: DEFAULT_SESSION_NAME, solves: [] }]
}

export const useTimerSessionsStore = defineStore('timerSessions', () => {
  const persisted = loadJson<PersistedTimerState>(TIMER_SESSIONS_STORAGE_KEY, {
    activeSessionName: DEFAULT_SESSION_NAME,
    sessions: defaultSessions(),
  })
  const sessions = ref<TimerSession[]>(
    persisted.sessions.length ? persisted.sessions : defaultSessions(),
  )
  const activeSessionName = ref<string>(persisted.activeSessionName)

  watch(
    [sessions, activeSessionName],
    () =>
      saveJson(TIMER_SESSIONS_STORAGE_KEY, {
        sessions: sessions.value,
        activeSessionName: activeSessionName.value,
      }),
    { deep: true },
  )

  const activeSession = computed(
    () => sessions.value.find((s) => s.name === activeSessionName.value) ?? sessions.value[0]!,
  )
  const solves = computed(() => activeSession.value.solves)

  function addSolve(time: number, scramble: string, penalty: SolvePenalty = 'none') {
    activeSession.value.solves.push({ time, penalty, scramble, date: Date.now() })
  }

  function setPenalty(index: number, penalty: SolvePenalty) {
    const solve = solves.value[index]
    if (!solve) return
    // Clicking the already-active penalty clears it back to 'none'.
    solve.penalty = solve.penalty === penalty ? 'none' : penalty
  }

  function deleteSolve(index: number) {
    solves.value.splice(index, 1)
  }

  function switchSession(name: string) {
    if (sessions.value.some((s) => s.name === name)) activeSessionName.value = name
  }

  function addSession(name: string) {
    const trimmed = name.trim()
    if (!trimmed || sessions.value.some((s) => s.name === trimmed)) return
    sessions.value.push({ name: trimmed, solves: [] })
    activeSessionName.value = trimmed
  }

  function deleteSession(name: string) {
    if (sessions.value.length <= 1) return
    sessions.value = sessions.value.filter((s) => s.name !== name)
    if (activeSessionName.value === name) activeSessionName.value = sessions.value[0]!.name
  }

  const ao5 = computed(() => average(solves.value, AO5_WINDOW))
  const ao12 = computed(() => average(solves.value, AO12_WINDOW))
  const ao100 = computed(() => average(solves.value, AO100_WINDOW))
  const meanTime = computed(() => mean(solves.value))
  const bestTime = computed(() => best(solves.value))

  return {
    sessions,
    activeSessionName,
    activeSession,
    solves,
    addSolve,
    setPenalty,
    deleteSolve,
    switchSession,
    addSession,
    deleteSession,
    ao5,
    ao12,
    ao100,
    meanTime,
    bestTime,
  }
})
