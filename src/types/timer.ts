export type TimerState = 'idle' | 'holding' | 'ready' | 'inspecting' | 'running'

export interface UseHoldTimerOptions {
  holdMs?: number
  /** Enables a WCA-style inspection phase (idle→inspecting) before running starts, this many ms long. */
  inspectionMs?: number
  onComplete?: (ms: number, penalty: SolvePenalty) => void
}

export interface OllAttempt {
  caseId: number
  ms: number | null // null = skipped, no time logged
  timestamp: number
}

export interface CaseStats {
  caseId: number
  name: string
  mean: number
  times: number[]
}

export type SolvePenalty = 'none' | '+2' | 'DNF'

export interface Solve {
  time: number
  penalty: SolvePenalty
  scramble: string
  date: number
}

export interface TimerSession {
  name: string
  solves: Solve[]
}

export interface PersistedTimerState {
  activeSessionName: string
  sessions: TimerSession[]
}
