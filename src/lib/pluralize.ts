/** Ukrainian plural forms: 1 кейс, 2-4 кейси, 0/5+ кейсів (with the usual 11-14 exception). */
export function pluralCases(n: number): string {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod10 === 1 && mod100 !== 11) return 'кейс'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'кейси'
  return 'кейсів'
}
