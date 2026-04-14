/**
 * Strips accents and uppercases. LUMIÈRE → LUMIERE, Jésus → JESUS.
 * Safe for all Latin-script locales (fr, en, pt).
 */
export function normaliseWord(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}
