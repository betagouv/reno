import { formatValue } from 'publicodes'
import { getRuleName } from './publicodes/utils'

export default function Geste({ dottedName, rules, engine }) {
  const questionRule = rules[dottedName]

  const montant = dottedName + ' . montant',
    barème = dottedName + ' . barème'

  const relevant = rules[barème] ? barème : montant

  const montantValue = formatValue(engine.evaluate(relevant)).replace(
    'm2',
    'm²',
  )

  const plafond = dottedName + ' . plafond',
    plafondValue = formatValue(engine.evaluate(plafond))
  return (
    <div>
      <div>{questionRule.titre || getRuleName(dottedName)}</div>

      <small
        title={`Pour bénéficier de l'aide de ${montantValue}, le coût du geste ne doit pas dépasser ${plafondValue}.`}
      >
        <Prime value={`${montantValue}`} /> pour max. {plafondValue}
      </small>
    </div>
  )
}
export const Prime = ({ value }) => (
  <span
    css={`
      color: rgb(11, 73, 48);
      background: #c4fad5;
      border: 1px solid rgb(128, 202, 151);
      padding: 0 0.3rem;
      border-radius: 0.2rem;
      white-space: nowrap;
    `}
  >
    {value}
  </span>
)
