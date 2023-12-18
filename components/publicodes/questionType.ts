export default function questionType(evaluation) {
  const ruleType = { number: 'number', string: 'text', undefined: 'text' }[
    evaluation.type
  ]
  console.log('question type', evaluation, ruleType)
  return ruleType
}
