import { omit, sortBy } from './utils'
import Select from './Select'
export default function Input({
  situation,
  onChange,
  value,
  rule,
  engine,
  type,
}) {
  /* First we went for Maxime's method on mesaidesvelo
   * consisting of doing a static analysis of candidate values,
   * then trying them all by evaluating them to see which
   * would change the final output.
   *
   * However, we've got lots of values here, it's an automated method but quite
   * inefficient. In our case, we know the format of our bounds. We'll do it by
   * hand for now.
   *
   * */
  const revenu = situation['ménage . revenu']
  const targets = ['ménage . revenu . barème IdF', 'ménage . revenu . barème']

  const idf = engine.evaluate('ménage . région . IdF')
  const evaluation = engine
    .setSituation(omit(['ménage . revenu'], situation))
    .evaluate(targets[idf.nodeValue ? 0 : 1])

  // We have multiple sources of thresholds to combine, since the introduction of aides-locales.yaml
  // Another strategy would be to combine them in YAML before parsing : parsing created more complicated object structures
  // I'm obviously not proud of this code. When we're getting serious, if more addition subventions include this kind of barème extension, we should code all this properly

  const activeBarème =
    evaluation.explanation.valeur.explanation.alors.explanation.find(
      (el) => el.condition.nodeValue,
    )

  const selectThresholds = (list) =>
    list
      .map((el) => {
        if (el.condition.isDefault) return false
        const conditionRightValue = engine.evaluate(
          el.condition.explanation[1],
        ).nodeValue
        if (conditionRightValue != null) return conditionRightValue

        throw new Error(
          'Impossible de calculer les bornes de revenu intelligentes.',
        )
      })
      .filter(Boolean)

  const baseList = selectThresholds(activeBarème.consequence.explanation)

  const additionalbarème =
    !idf.nodeValue &&
    engine
      .evaluate(`aides locales . angers . revenu très très modeste`)
      .explanation.valeur.explanation.alors.explanation.find(
        (branch) => branch.condition.nodeValue === true,
      )

  const additionalList = additionalbarème
    ? [engine.evaluate(additionalbarème.consequence[1]).nodeValue]
    : []

  const list = sortBy((el) => el)([...baseList, ...additionalList])

  const lastThreshold = list.slice(-1)[0]

  // Dans le cas d'un affichage en select, on n'a pas besoin des valeurs de l'aide locale d'Angers
  // car il s'agit des questions nationaux MPR et Coup de pouce
  return type === 'select' ? (
    <Select
      value={value}
      values={[...baseList, Infinity].map((threshold) => {
        return {
          valeur: threshold === Infinity ? lastThreshold + 1 : threshold - 1,
          titre: displayRevenuLabel(threshold, lastThreshold),
        }
      })}
      onChange={onChange}
    />
  ) : (
    [...list, Infinity].map((threshold, index) => {
      const valueToSet =
        threshold === Infinity ? lastThreshold + 1 : threshold - 1
      return (
        <label
          key={threshold}
          css={`
            cursor: pointer;
            padding: calc(0.3rem + 0.7vw) calc(0.5rem + 1vw);
            border: 2px solid #dfdff1;
            border-radius: 0.3rem;
            &:hover {
              border: 2px solid #004396;
            }
            display: flex;
            align-items: center;
            margin-bottom: 0.6rem;
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
            name={threshold}
            value={threshold}
            checked={revenu > (list[index - 1] || 0) && revenu <= threshold}
            onChange={(e) => onChange(valueToSet)}
          />{' '}
          <span>{displayRevenuLabel(threshold, lastThreshold)}</span>
        </label>
      )
    })
  )
}
const displayRevenuLabel = (threshold, lastThreshold) =>
  threshold === Infinity
    ? 'supérieur à ' + formatNumber(lastThreshold) + '€'
    : 'inférieur à ' + formatNumber(threshold) + '€'

const numberFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
})
const formatNumber = (n) => numberFormatter.format(n)
