/** Ukrainian plural form selection: 1 → one, 2-4 → few, 0/5+ → many (with the usual 11-14 exception). */
export function pluralizeUk(n: number, [one, few, many]: [string, string, string]): string {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** OLL case count: 1 кейс, 2-4 кейси, 0/5+ кейсів. */
export function pluralCases(n: number): string {
  return pluralizeUk(n, ['кейс', 'кейси', 'кейсів'])
}

/** Solve count: 1 розв'язок, 2-4 розв'язки, 0/5+ розв'язків. */
export function pluralSolves(n: number): string {
  return pluralizeUk(n, ["розв'язок", "розв'язки", "розв'язків"])
}
