export default function questionType(evaluation, yamlRule) {
  if (yamlRule['par défaut']) return 'boolean'
  const ruleType = { number: 'number', string: 'text', undefined: 'text' }[
    evaluation.type
  ]
  console.log('question type', evaluation, ruleType)
  return ruleType
}
