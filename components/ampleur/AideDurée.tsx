export default function ({ engine, situation, dottedName }) {
  const rules = engine.getParsedRules()
  const duréeName =
    dottedName.replace(/\s.\smontant$/, ' . ') +
    (dottedName.includes('denormandie') ? 'années de location' : 'durée')
  const duréeRule = rules[duréeName]

  if (!duréeRule) return null
  const evaluation = engine.setSituation(situation).evaluate(duréeName)
  return <span> sur {evaluation.nodeValue} ans</span>
}
