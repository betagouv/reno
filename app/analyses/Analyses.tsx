import Engine from 'publicodes'
import rules from '@/app/règles/rules'

// Initialize the publicodes engine once with mesaidesreno rules
const engine = new Engine(rules)

// Utility function to evaluate a publicodes rule
function evaluatePublicodesRule(
  ruleName: string,
  situation: Record<string, any>,
) {
  // Reset the situation to avoid side effects

  // Set the situation
  engine.setSituation(situation)

  // Evaluate the rule
  const evaluation = engine.evaluate(ruleName)

  return {
    value: evaluation.nodeValue,
    formatted:
      evaluation.nodeValue !== null
        ? `${evaluation.nodeValue} ${evaluation.unit || ''}`
        : 'Rule not applicable',
    missingVariables: evaluation.missingVariables,
  }
}

export default function Analyses() {
  // Generate a random income between 10000 and 100000
  const randomRevenu = Math.floor(Math.random() * 90000) + 10000

  // Evaluate the rule "MPR . accompagnée . montant" with the random income
  const result = evaluatePublicodesRule('MPR . accompagnée . montant', {
    'ménage . revenu': randomRevenu,
  })

  return (
    <section>
      <h2>Analysis of the rule "MPR . accompagnée . montant"</h2>
      <p>Random income used: {randomRevenu} €</p>
      <p>Evaluation result: {result.formatted}</p>
      {Object.keys(result.missingVariables).length > 0 && (
        <div>
          <p>Missing variables for complete calculation:</p>
          <ul>
            {Object.keys(result.missingVariables).map((variable) => (
              <li key={variable}>{variable}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
