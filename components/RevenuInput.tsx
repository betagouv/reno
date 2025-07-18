import Select from '@codegouvfr/react-dsfr/Select'
import { omit } from './utils'
export const displayRevenuLabel = (situation, engine, threshold) => {
  const list = getRevenusList(situation, engine)
  const lastThreshold = list.slice(-1)[0]
  return threshold > lastThreshold
    ? 'supérieur ou égal à ' + formatNumber(lastThreshold) + ' €'
    : 'inférieur à ' + formatNumber(threshold) + ' €'
}

export const formatNumber = (n) =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(n)

export function getRevenusList(situation, engine) {
  const targets = ['ménage . revenu . barème IdF', 'ménage . revenu . barème']
  const idf = engine.evaluate(
    (situation['logement . propriétaire occupant'] == 'oui'
      ? 'logement'
      : 'ménage') + ' . région . IdF',
  )
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
  label,
  situation,
  onChange,
  value,
  engine,
  type,
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
      label={label}
      nativeSelectProps={{
        onChange: onChange,
        value: value,
      }}
      state={revenu !== undefined ? 'success' : 'default'}
    >
      <option value="" disabled hidden>
        Sélectionnez une option
      </option>
      {selectValues.map(({ valeur, titre }, index) => (
        <option key={index} value={valeur}>
          {titre}
        </option>
      ))}
    </Select>
  ) : (
    selectValues.map(({ valeur, titre }, index) => (
      <div className="fr-fieldset__element" key={index}>
        <div className="fr-radio-group fr-radio-rich">
          <input
            type="radio"
            id={`radio-${index}`}
            name="radio"
            value={valeur}
            checked={revenu > (list[index - 1] || 0) && revenu <= valeur}
            onChange={() => onChange(valeur)}
          />
          <label className="fr-label" htmlFor={`radio-${index}`}>
            <span>{titre}</span>
          </label>
        </div>
      </div>
    ))
  )
}
