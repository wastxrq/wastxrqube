/** Formats a duration in milliseconds as a stopwatch string, e.g. 4.91 or 1:06.15. */
export function formatTime(ms: number): string {
  const totalCs = Math.round(ms / 10)
  const min = Math.floor(totalCs / 6000)
  const sec = Math.floor((totalCs % 6000) / 100)
  const cs = totalCs % 100
  const secStr = min > 0 ? String(sec).padStart(2, '0') : String(sec)
  const csStr = String(cs).padStart(2, '0')
  return min > 0 ? `${min}:${secStr}.${csStr}` : `${secStr}.${csStr}`
}
