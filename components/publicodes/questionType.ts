export default function questionType(rule) {
  const ruleType = typeof rule['par défaut']
  return { number: 'number', string: 'text' }[ruleType]
}
