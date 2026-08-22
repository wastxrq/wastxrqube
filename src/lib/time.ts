import { MONTHS_UK_SHORT } from '@/constants'

/** Formats a duration in milliseconds as a stopwatch string, e.g. 4.91 or 1:06.15. Returns 'DNF' for Infinity (a did-not-finish average or solve). */
export function formatTime(ms: number): string {
  if (ms === Infinity) return 'DNF'
  const totalCs = Math.round(ms / 10)
  const min = Math.floor(totalCs / 6000)
  const sec = Math.floor((totalCs % 6000) / 100)
  const cs = totalCs % 100
  const secStr = min > 0 ? String(sec).padStart(2, '0') : String(sec)
  const csStr = String(cs).padStart(2, '0')
  return min > 0 ? `${min}:${secStr}.${csStr}` : `${secStr}.${csStr}`
}

/** Formats a Date#getTime() timestamp readably, e.g. "22 сер, 14:32". */
export function formatDate(ms: number): string {
  const d = new Date(ms)
  const day = d.getDate()
  const month = MONTHS_UK_SHORT[d.getMonth()]
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${month}, ${hh}:${mm}`
}
