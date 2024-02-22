import rules from '@/app/règles/rules'
import Engine, { formatValue } from 'publicodes'
import { getRuleName } from './publicodes/utils'

export const safeEngine = new Engine(rules)

export default function Geste({ dottedName, rules }) {
  const questionRule = rules[dottedName]

  const montant = dottedName + ' . montant',
    barème = dottedName + ' . barème'

  const relevant = rules[barème] ? barème : montant

  const montantValue = formatValue(safeEngine.evaluate(relevant)).replace(
    'm2',
    'm²',
  )

  const plafond = dottedName + ' . plafond',
    plafondValue = formatValue(safeEngine.evaluate(plafond))
  return (
    <div>
      <div>{questionRule.titre || getRuleName(dottedName)}</div>

      <small>
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
