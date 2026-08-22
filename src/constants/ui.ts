// Case card diagram-square size, shared between CaseCard and the selector's card grid.
// Scales fluidly between these bounds (via a CSS clamp()) so small screens keep the
// compact size while large screens get bigger, more legible cards.
export const CASE_CARD_MIN_SIZE_PX = 110
export const CASE_CARD_MAX_SIZE_PX = 160

/** Number of most-recent timed attempts averaged for the "recent mean" stat. */
export const RECENT_MEAN_WINDOW = 50

/** Ukrainian short month names (genitive), indexed by Date#getMonth(), for readable solve timestamps. */
export const MONTHS_UK_SHORT = [
  'січ',
  'лют',
  'бер',
  'кві',
  'тра',
  'чер',
  'лип',
  'сер',
  'вер',
  'жов',
  'лис',
  'гру',
]
