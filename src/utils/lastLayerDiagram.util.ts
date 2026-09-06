import { LAST_LAYER_DIAGRAM_LAYOUT } from '@/constants'
import type { DiagramPoint, DiagramRect } from '@/types'

const { MARGIN, FLAP, GAP, ORIGIN, CELL, GRID } = LAST_LAYER_DIAGRAM_LAYOUT

export function getGridCellRect(index: number): DiagramRect {
  const row = Math.floor(index / 3)
  const col = index % 3
  return {
    x: ORIGIN + col * CELL,
    y: ORIGIN + row * CELL,
    w: CELL - GAP,
    h: CELL - GAP,
  }
}

/** Center point of a grid cell, e.g. for anchoring a permutation arrow (see PllCaseDiagram.vue). */
export function getGridCellCenter(index: number): DiagramPoint {
  const row = Math.floor(index / 3)
  const col = index % 3
  return {
    x: ORIGIN + col * CELL + CELL / 2,
    y: ORIGIN + row * CELL + CELL / 2,
  }
}

export function getTopFlapRect(index: number): DiagramRect {
  return { x: ORIGIN + index * CELL, y: MARGIN, w: CELL - GAP, h: FLAP - GAP }
}

export function getBottomFlapRect(index: number): DiagramRect {
  return { x: ORIGIN + index * CELL, y: ORIGIN + GRID, w: CELL - GAP, h: FLAP - GAP }
}

export function getLeftFlapRect(index: number): DiagramRect {
  return { x: MARGIN, y: ORIGIN + index * CELL, w: FLAP - GAP, h: CELL - GAP }
}

export function getRightFlapRect(index: number): DiagramRect {
  return { x: ORIGIN + GRID, y: ORIGIN + index * CELL, w: FLAP - GAP, h: CELL - GAP }
}
