export type TimerState = 'idle' | 'holding' | 'ready' | 'running'

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
