import Engine, { formatValue } from 'publicodes'
import rules from '@/app/règles/rules'
import baseSituation from '@/app/analyses/baseSituation.yaml'
import dynamic from 'next/dynamic'

// Importer recharts avec dynamic import pour éviter les problèmes SSR
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })

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
  const min = 1000;
  const max = 100000;
  const step = (max - min) / (count - 1);
  
  return Array.from({ length: count }, (_, i) => Math.round(min + i * step));
}

// Function to evaluate a rule for multiple revenue values
function evaluateRuleForMultipleRevenues(ruleName: string, revenueValues: number[]) {
  return revenueValues.map(revenue => {
    const result = evaluatePublicodesRule(ruleName, {
      ...baseSituation,
      'ménage . revenu': revenue,
    });
    
    return {
      revenue: revenue,
      montant: typeof result.value === 'number' ? result.value : 0,
      formatted: result.formatted,
    };
  });
}

export default function Analyses() {
  // Generate 10 revenue values from 1000 to 100000
  const revenueValues = generateRevenueValues(10);
  
  // Evaluate the rule for each revenue value
  const results = evaluateRuleForMultipleRevenues('MPR . accompagnée . montant', revenueValues);
  
  return (
    <section>
      <h2>Analyse de la règle "MPR . accompagnée . montant"</h2>
      <p>Montant de l'aide en fonction du revenu du ménage</p>
      
      <div style={{ width: '100%', height: 500, marginTop: 20 }}>
        {typeof window !== 'undefined' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={results}
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: 'Montant (€)', position: 'insideBottom', offset: -5 }} />
              <YAxis 
                type="category" 
                dataKey="revenue" 
                tickFormatter={(value) => `${value.toLocaleString('fr-FR')} €`}
                label={{ value: 'Revenu du ménage (€)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, 'Montant de l\'aide']}
                labelFormatter={(value) => `Revenu: ${value.toLocaleString('fr-FR')} €`}
              />
              <Legend />
              <Bar dataKey="montant" name="Montant MPR accompagnée" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <h3>Données détaillées</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Revenu</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Montant de l'aide</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.revenue.toLocaleString('fr-FR')} €</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.formatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
