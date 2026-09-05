// Case card diagram-square size (shared by CaseCard and the selector's grid),
// scaled fluidly between these bounds via a CSS clamp().
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
