import rules from '@/app/règles/rules'
import { capitalise0, formatValue } from 'publicodes'
import { computeAideStatus } from './AmpleurSummary'

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
          baseDottedName: split[0],
          icône: parentRule.icône,
          marque: parentRule.marque,
          'complément de marque': parentRule['complément de marque'],
          type: parentRule['type'],
        }
      }
      return { ...rule, dottedName, baseDottedName: dottedName }
    })

const regexp = /aides locales \. (.+) \. montant$/

export const findAidesLocales = (rules, engine) => {
  const candidates = Object.entries(rules).filter(
    ([dottedName]) =>
      dottedName.match(regexp) && dottedName.split(' . ').length === 3,
  )

  const found = candidates
    .map(([dottedName]) => engine.evaluate(dottedName))
    .filter(
      (evaluation) =>
        evaluation.nodeValue > 0 || evaluation.nodeValue === false,
    )

  console.log('lightbrown aides locales', {
    candidates,
    found,
  })

  try {
    return found.map((evaluation) => ({
      ...evaluation,
      name: capitalise0(evaluation.dottedName.match(regexp)[1]),
      level: rules[evaluation.dottedName].remplace,
    }))
  } catch (e) {
    console.error('Could not derive the name of the aide locale')
    return []
  }
}

export function useAides(engine, situation) {
  const aides = list.map((aide) => {
    const evaluation = engine.setSituation(situation).evaluate(aide.dottedName)
    const value = formatValue(evaluation, { precision: 0 })

    const status = computeAideStatus(evaluation)
    const marque2 = aide.dottedName.startsWith('aides locales')
      ? findAidesLocales(rules, engine)
          .map((aide) => aide.name)
          .join(', ')
      : aide['complément de marque']

    return {
      ...aide,
      evaluation,
      value,
      status,
      'complément de marque': marque2,
    }
  })

  return aides
}
