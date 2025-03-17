import Engine from 'publicodes'
import rules from 'mesaidesreno'

// Initialiser le moteur publicodes une seule fois avec les règles de mesaidesreno
const engine = new Engine(rules)

// Fonction utilitaire pour évaluer une règle publicodes
function evaluatePublicodesRule(ruleName: string, situation: Record<string, any>) {
  // Réinitialiser la situation pour éviter les effets de bord
  engine.resetSituation()
  
  // Définir la situation
  engine.setSituation(situation)
  
  // Évaluer la règle
  const evaluation = engine.evaluate(ruleName)
  
  return {
    value: evaluation.nodeValue,
    formatted: evaluation.nodeValue !== null ? 
      `${evaluation.nodeValue} ${evaluation.unit || ''}` : 
      'Règle non applicable',
    missingVariables: evaluation.missingVariables
  }
}

export default function Analyses() {
  // Générer un revenu aléatoire entre 10000 et 100000
  const randomRevenu = Math.floor(Math.random() * 90000) + 10000
  
  // Évaluer la règle "MPR . accompagnée . montant" avec le revenu aléatoire
  const result = evaluatePublicodesRule('MPR . accompagnée . montant', {
    'revenu': randomRevenu
  })

  return (
    <section>
      <h2>Analyse de la règle "MPR . accompagnée . montant"</h2>
      <p>Revenu aléatoire utilisé: {randomRevenu} €</p>
      <p>Résultat de l'évaluation: {result.formatted}</p>
      {Object.keys(result.missingVariables).length > 0 && (
        <div>
          <p>Variables manquantes pour le calcul complet:</p>
          <ul>
            {Object.keys(result.missingVariables).map(variable => (
              <li key={variable}>{variable}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
