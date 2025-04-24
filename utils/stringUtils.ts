/**
 * Tronque une chaîne de caractères à une longueur maximale spécifiée
 * et ajoute "..." si la chaîne est tronquée
 *
 * @param text - Le texte à tronquer
 * @param maxLength - La longueur maximale (défaut: 100)
 * @returns Le texte tronqué avec "..." si nécessaire
 */
export function truncateDescription(
  text: string,
  maxLength: number = 100,
): string {
  if (!text) return ''

  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength) + '...'
}
