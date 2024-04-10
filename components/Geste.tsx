import { formatValue } from 'publicodes'
import { getRuleName } from './publicodes/utils'

export default function Geste({
  dottedName,
  rules,
  engine,
  expanded,
  situation,
}) {
  const questionRule = rules[dottedName]

  const montant = dottedName + ' . montant',
    barème = dottedName + ' . barème'

  const relevant = rules[barème] ? barème : montant

  const montantValue = formatValue(
    engine.setSituation(situation).evaluate(relevant),
  ).replace('m2', 'm²')

  const plafond = dottedName + ' . plafond',
    plafondValue = formatValue(engine.setSituation(situation).evaluate(plafond))

  if (!expanded)
    return (
      <div>
        <div
          css={`
            margin: 0.6rem 0;
          `}
        >
          {questionRule.titre || getRuleName(dottedName)}
        </div>
        <Prime value={`${montantValue}`} />
      </div>
    )
  return (
    <div>
      <div>{questionRule.titre || getRuleName(dottedName)}</div>

      <small
        title={`Pour bénéficier de l'aide de ${montantValue}, le coût du geste ne doit pas dépasser ${plafondValue}.`}
      >
        {expanded ? (
          <span>
            <Prime value={`${montantValue}`} /> de prime, éligible pour un geste
            qui coûte au maximum {plafondValue}.
          </span>
        ) : (
          <span>
            <Prime value={`${montantValue}`} /> pour max. {plafondValue}
          </span>
        )}
      </small>
    </div>
  )
}
export const Prime = ({ value }) => (
  <strong
    css={`
      color: #356e3e;
      background: #bef2c5;
      border: 1px solid #356e3e4d;
      padding: 0.2rem 0.4rem 0.1rem;
      border-radius: 0.2rem;
      white-space: nowrap;
    `}
  >
    {value}
  </strong>
)
