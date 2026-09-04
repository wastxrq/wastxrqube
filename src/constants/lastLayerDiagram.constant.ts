// Shared 0-100 viewBox geometry for OllCaseDiagram.vue and PllCaseDiagram.vue: a
// background panel with the U-layer grid in the middle and a thin flap strip on
// each side, showing the adjacent side stickers.
const MARGIN = 4
const FLAP = 10
const GAP = 1.5
const ORIGIN = MARGIN + FLAP
const CELL = (100 - 2 * ORIGIN) / 3

export const LAST_LAYER_DIAGRAM_LAYOUT = {
  MARGIN,
  FLAP,
  GAP,
  ORIGIN,
  CELL,
  GRID: CELL * 3,
} as const
