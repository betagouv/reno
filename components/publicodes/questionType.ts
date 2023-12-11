export default function questionType(evaluation) {
  const ruleType = { number: 'number', string: 'text', undefined: 'text' }[
    evaluation.type
  ]
  console.log(evaluation, ruleType)
  return ruleType
}
