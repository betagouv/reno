import { useEffect, useState } from 'react'
import Engine from 'publicodes'
import rules from 'mesaidesreno'

export default function Analyses() {
  const [result, setResult] = useState<string | null>(null)
  const [randomRevenu, setRandomRevenu] = useState<number>(0)

  useEffect(() => {
    // Générer un revenu aléatoire entre 10000 et 100000
    const revenu = Math.floor(Math.random() * 90000) + 10000
    setRandomRevenu(revenu)

    // Initialiser le moteur publicodes avec les règles de mesaidesreno
    const engine = new Engine(rules)
    
    // Définir la situation avec le revenu aléatoire
    engine.setSituation({
      'revenu': revenu
    })
    
    // Évaluer la règle "MPR . accompagnée . montant"
    const evaluation = engine.evaluate('MPR . accompagnée . montant')
    
    // Récupérer le résultat formaté
    setResult(evaluation.nodeValue !== null ? 
      `${evaluation.nodeValue} ${evaluation.unit || ''}` : 
      'Règle non applicable')
  }, [])

  return (
    <section>
      <h2>Analyse de la règle "MPR . accompagnée . montant"</h2>
      <p>Revenu aléatoire utilisé: {randomRevenu} €</p>
      <p>Résultat de l'évaluation: {result || 'Calcul en cours...'}</p>
    </section>
  )
}
