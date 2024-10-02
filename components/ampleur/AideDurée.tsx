export default function ({ engine, dottedName }) {
  const rules = engine.getParsedRules()
  const duréeName = dottedName.replace(/\s.\smontant$/, '') + ' . durée'
  console.log('PPLOP', duréeName)
  const duréeRule = rules[duréeName]

  if (!duréeRule) return null
  const evaluation = engine.evaluate(duréeName)
  return <span>sur {evaluation.nodeValue} ans</span>
}
