export type Facelet = 'U' | 'R' | 'F' | 'D' | 'L' | 'B'

export interface LastLayerView {
  grid: Facelet[]
  top: Facelet[]
  bottom: Facelet[]
  left: Facelet[]
  right: Facelet[]
}

export interface FaceLayoutEntry {
  face: Facelet
  col: number
  row: number
  startIndex: number
}
