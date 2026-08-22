/**
 * Ukrainian plural form selection: 1 → one, 2-4 → few, 0/5+ → many (with the usual 11-14 exception).
 * The word triplet is supplied by the caller (via i18n) rather than hardcoded here, so this same
 * selection logic is reused for en/es too — for locales with only singular/plural, pass the same
 * string for `few` and `many`.
 */
export function pluralizeUk(n: number, [one, few, many]: [string, string, string]): string {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
