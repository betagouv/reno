import { formatValue } from '@/node_modules/publicodes/dist/index'
import { compute } from './Aide'
import { Key, P } from './ExplicationUI'

export default function Travaux({ engine, rules, situation }) {
  const upEngine = engine.setSituation(situation)

  const plafonnés = compute('travaux . plafonnés', upEngine, rules)
  const travaux = compute('travaux', upEngine, rules)

  if (travaux.hasMissing) return null

  return (
    <section>
      <h3>Le montant de vos travaux</h3>

      <P>
        Le montant de vos travaux est de{' '}
        <Key $state={travaux.hasMissing ? 'inProgress' : 'final'}>
          {travaux.value} €
        </Key>
        {plafonnés.node.nodeValue < travaux.node.nodeValue && (
          <span>
            , mais l'aide ne s'appliquera qu'à un plafond de{' '}
            <Key $state={plafonnés.hasMissing ? 'inProgress' : 'final'}>
              {plafonnés.value}
            </Key>
          </span>
        )}
        .
      </P>
    </section>
  )
}
