import { omit } from './utils'
import Select from './Select'

export const displayRevenuLabel = (situation, engine, threshold) => {
  const list = getRevenusList(situation, engine)
  const lastThreshold = list.slice(-1)[0]
  return threshold > lastThreshold
    ? 'supérieur à ' + formatNumber(lastThreshold) + '€'
    : 'inférieur à ' + formatNumber(threshold) + '€'
}

const formatNumber = (n) =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(n)

export function getRevenusList(situation, engine) {
  const targets = ['ménage . revenu . barème IdF', 'ménage . revenu . barème']
  const idf = engine.evaluate('ménage . région . IdF')
  const activeEvaluation = engine
    .setSituation(omit(['ménage . revenu'], situation))
    .evaluate(targets[idf.nodeValue ? 0 : 1])

  const activeBarème =
    activeEvaluation.explanation.valeur.explanation.alors.explanation.find(
      (el) => el.condition.nodeValue,
    )

  if (!activeBarème) throw new Error('Active barème could not be found.')

  return activeBarème.consequence.explanation
    .map((el) => {
      const rightValue = el.condition.isDefault
        ? null
        : engine.evaluate(el.condition.explanation[1]).nodeValue
      return rightValue
    })
    .filter(Boolean)
}

export default function RevenuInput({
  situation,
  onChange,
  value,
  engine,
  type,
  disableInstruction = true,
}) {
  const revenu = situation['ménage . revenu']
  const list = getRevenusList(situation, engine)
  const lastThreshold = list.slice(-1)[0]
  // Generate selectable items for the list
  const selectValues = [...list, lastThreshold + 1].map((threshold) => ({
    valeur: threshold === lastThreshold + 1 ? lastThreshold + 1 : threshold - 1,
    titre: displayRevenuLabel(situation, engine, threshold),
  }))

  return type === 'select' ? (
    <Select
      value={value}
      values={selectValues}
      onChange={onChange}
      disableInstruction={disableInstruction}
    />
  ) : (
    selectValues.map(({ valeur, titre }, index) => (
      <label
        key={valeur}
        css={`
          cursor: pointer;
          padding: calc(0.3rem + 0.7vw) calc(0.5rem + 1vw);
          border: 2px solid #dfdff1;
          border-radius: 0.3rem;
          display: flex;
          align-items: center;
          margin-bottom: 0.6rem;
          &:hover,
          &:has(input:checked) {
            border: 2px solid #004396;
          }
        `}
      >
        <input
          css={`
            width: 1.4rem;
            height: 1.4rem;
            cursor: pointer;
            margin-right: 0.6rem;
          `}
          type="radio"
          name={valeur}
          value={valeur}
          checked={revenu > (list[index - 1] || 0) && revenu <= valeur}
          onChange={() => onChange(valeur)}
        />
        <span>{titre}</span>
      </label>
    ))
  )
}
