import { formatValue } from '@/node_modules/publicodes/dist/index'
import { Key } from './ExplicationUI'
import ParGeste from './ParGeste'

const getMissings = (evaluation, rules) => {
  const missing = Object.entries(evaluation.missingVariables).map(
    ([k, v]) => rules[k],
  )
  return [missing, missing.length > 0]
}

export const compute = (name, upEngine, rules) => {
  const node = upEngine.evaluate(name),
    value = formatValue(node),
    [missing, hasMissing] = getMissings(node, rules)

  return { node, value, missing, hasMissing, source: rules[name] }
}
export default function Travaux({ engine, rules, situation }) {
  const upEngine = engine.setSituation(situation)

  const montant = compute('MPR . accompagnée . montant', upEngine, rules)
  const pourcentÉcrêté = compute(
    'MPR . accompagnée . pourcent écrêté',
    upEngine,
    rules,
  )
  const écrêtement = compute(
    'MPR . accompagnée . pourcent écrêté',
    upEngine,
    rules,
  )
  const isÉcrêté = compute('MPR . accompagnée . écrêté', upEngine, rules)
  const sautsMin = compute('MPR . accompagnée . sauts minimum', upEngine, rules)

  return (
    <section>
      <h3>Votre aide</h3>
      <h4>MaPrimeRénov' parcours accompagné</h4>
      <p>
        Votre aide MaPrimeRénov' parcours accompagné s'élèvera à&nbsp;
        <Key $state={montant.hasMissing ? 'inProgress' : 'final'}>
          {montant.value}
        </Key>
        , soit{' '}
        <Key $state={pourcentÉcrêté.hasMissing ? 'inProgress' : 'final'}>
          {pourcentÉcrêté.value}
        </Key>{' '}
        de votre enveloppe plafonnée.{' '}
        {montant.node.nodeValue === 0 ? (
          <span>
            En effet, il faut {sautsMin.source} sauts au minimum pour obtenir
            l'aide.
          </span>
        ) : (
          ''
        )}
      </p>
      <p>
        {isÉcrêté.value === 'oui' ? (
          <span>
            {' '}
            mais le total est limité à un taux maximum de{' '}
            <Key>{écrêtement.value}</Key>
          </span>
        ) : (
          ''
        )}
        .
      </p>
      <ParGeste engine={engine} rules={rules} />
    </section>
  )
}
