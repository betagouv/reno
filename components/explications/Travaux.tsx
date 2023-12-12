import { formatValue } from '@/node_modules/publicodes/dist/index'
import { Key, P } from './ExplicationUI'
import Travaux from './Travaux'

const getMissings = (evaluation, rules) => {
  const missing = Object.entries(evaluation.missingVariables).map(
    ([k, v]) => rules[k],
  )
  return [missing, missing.length > 0]
}
export default function Travaux({ engine, rules, situation }) {
  const upEngine = engine.setSituation(situation)

  const plafonnés = upEngine.evaluate('travaux . plafonnés'),
    plafonnésValue = formatValue(plafonnés),
    [plafonnésMissing, hasPlafonnésMissing] = getMissings(plafonnés, rules)
  const travaux = upEngine.evaluate('travaux'),
    travauxValue = formatValue(travaux),
    [travauxMissing, hasTravauxMissing] = getMissings(travaux, rules)

  if (hasTravauxMissing) return null

  return (
    <section>
      <h3>Le montant de vos travaux</h3>

      <P>
        Le montant brut de vos travaux est de{' '}
        <Key $state={hasTravauxMissing ? 'inProgress' : 'final'}>
          {travauxValue}
        </Key>
        {plafonnés && (
          <span>
            , mais ils sont plafonnés à{' '}
            <Key $state={hasPlafonnésMissing ? 'inProgress' : 'final'}>
              {plafonnésValue}
            </Key>
          </span>
        )}
      </P>
    </section>
  )
}
