import Engine, { formatValue } from 'publicodes'
import rules from '@/app/règles/rules'
import baseSituation from '@/app/analyses/baseSituation.yaml'
import { OurLineChart } from './LineChart'

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
    formatted: formatValue(evaluation),
    missingVariables: evaluation.missingVariables,
  }
}

// Function to generate revenue values from 1000 to 100000
function generateRevenueValues(count: number) {
  const min = 1000
  const max = 100000
  const step = (max - min) / (count - 1)

  return Array.from({ length: count }, (_, i) => Math.round(min + i * step))
}

// Function to evaluate a rule for multiple revenue values
function evaluateRuleForMultipleRevenues(
  ruleName: string,
  revenueValues: number[],
) {
  return revenueValues.map((revenue) => {
    const result = evaluatePublicodesRule(ruleName, {
      ...baseSituation,
      'ménage . revenu': revenue,
    })

    return {
      revenue: revenue,
      montant: typeof result.value === 'number' ? result.value : 0,
      formatted: result.formatted,
    }
  })
}

export default function Analyses() {
  // Generate 10 revenue values from 1000 to 100000
  const revenueValues = generateRevenueValues(10)

  // Evaluate the rule for each revenue value
  const results = evaluateRuleForMultipleRevenues(
    'MPR . accompagnée . montant',
    revenueValues,
  )

  return (
    <section>
      <h2>Analyse de la règle "MPR . accompagnée . montant"</h2>
      <p>Montant de l'aide en fonction du revenu du ménage</p>

      <div style={{ width: '100%', height: 450, marginTop: 20 }}>
        <OurLineChart data={results} />
      </div>

      <h3>Données détaillées</h3>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Revenu
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              Montant de l'aide
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {result.revenue.toLocaleString('fr-FR')} €
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {result.formatted}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
