/** Hold duration before the timer arms (turns ready to start on release). */
export const DEFAULT_HOLD_MS = 300

/** A solve counts as "slow" (recap-worthy) once it's this many times the case's own historical average. */
export const SLOW_THRESHOLD_FACTOR = 1.5

/** How long a finished time stays on screen before advancing to the next case. */
export const RESULT_DISPLAY_DELAY_MS = 500

/** Default name given to a timer session that hasn't been renamed. */
export const DEFAULT_SESSION_NAME = 'Сесія 1'

/** Window sizes for the ao5/ao12/ao100 rolling averages. */
export const AO5_WINDOW = 5
export const AO12_WINDOW = 12
export const AO100_WINDOW = 100
