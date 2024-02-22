export default function questionType(evaluation, yamlRule) {
  if (yamlRule['par défaut'] && ['oui', 'non'].includes(yamlRule['par défaut']))
    return 'boolean'
  const value = evaluation.nodeValue
  const ruleType = { number: 'number', string: 'text', undefined: 'text' }[
    typeof value
  ]
  return ruleType
}
