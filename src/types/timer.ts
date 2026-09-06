export type TimerState = 'idle' | 'holding' | 'ready' | 'inspecting' | 'running'

/** A WCA event ID accepted by cubing/scramble's randomScrambleForEvent (see lib/scramble.ts). */
export type ScrambleEvent = '333'

export interface UseHoldTimerOptions {
  holdMs?: number
  /** Enables a WCA-style inspection phase (idle→inspecting) before running starts, this many ms long. */
  inspectionMs?: number
  onComplete?: (ms: number, penalty: SolvePenalty) => void
}

export interface UseHoldTimerInputOptions {
  /** Extra guard checked only when about to start a fresh hold (state === 'idle'), e.g. "a case is selected". */
  canStart?: () => boolean
  /** Wires Escape to this if provided (only the main Timer's inspection phase uses it); omitted elsewhere. */
  onCancelKey?: () => void
}

export interface CaseAttempt<TId extends string | number = string | number> {
  caseId: TId
  ms: number | null // null = skipped, no time logged
  timestamp: number
}

export interface CaseStats<TId extends string | number = string | number> {
  caseId: TId
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
