import rules from '@/app/règles/rules'
import { formatValue } from 'publicodes'
import { computeAideStatus } from '../AmpleurSummary'

const topList = rules['ampleur . tous les dispositifs'].somme,
  // unfold the sums with one level only, no recursion yet
  list = topList
    .map((dottedName) => {
      const rule = rules[dottedName]
      if (rule.somme) return rule.somme
      return dottedName
    })
    .flat()
    .map((dottedName) => {
      const rule = rules[dottedName]
      const split = dottedName.split(' . montant')
      if (split.length > 1) {
        const parentRule = rules[split[0]]
        return {
          ...rule,
          dottedName,
          icône: parentRule.icône,
          marque: parentRule.marque,
          'complément de marque': parentRule['complément de marque'],
          type: parentRule['type'],
        }
      }
      return { ...rule, dottedName }
    })

export function useAides(engine) {
  const aides = list.map((aide) => {
    const evaluation = engine
      //.setSituation(extremeSituation)
      .evaluate(aide.dottedName)
    const value = formatValue(evaluation, { precision: 0 })

    const status = computeAideStatus(evaluation)
    return { ...aide, evaluation, value, status }
  })

  return aides
}
