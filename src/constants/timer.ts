export const TIMER_CONSTANTS = {
  /** Hold duration before the timer arms (turns ready to start on release). */
  DEFAULT_HOLD_MS: 300,

  /** A solve counts as "slow" (recap-worthy) once it's this many times the case's own historical average. */
  SLOW_THRESHOLD_FACTOR: 1.5,

  /** How long a finished time stays on screen before advancing to the next case. */
  RESULT_DISPLAY_DELAY_MS: 500,

  /** Default name given to a timer session that hasn't been renamed. */
  DEFAULT_SESSION_NAME: 'Session 1',

  /** Window sizes for the ao5/ao12/ao100 rolling averages. */
  AO5_WINDOW: 5,
  AO12_WINDOW: 12,
  AO100_WINDOW: 100,

  /** Length of the WCA-style inspection countdown shown before a solve. */
  INSPECTION_MS: 15_000,

  /** A solve is auto-tagged '+2' once it starts this many ms into inspection. */
  INSPECTION_PLUS_TWO_THRESHOLD_MS: 8_000,

  /** A solve is auto-tagged 'DNF' once it starts this many ms into inspection. */
  INSPECTION_DNF_THRESHOLD_MS: 17_000,

  /** Minimum rightward drag (px), during inspection, to count as a "swipe to cancel" gesture — see useHoldTimerInput. */
  SWIPE_CANCEL_THRESHOLD_PX: 70,

  /** How much more horizontal than vertical a drag must be to read as a swipe rather than a scroll/diagonal drag. */
  SWIPE_CANCEL_HORIZONTAL_RATIO: 1.5,
} as const
