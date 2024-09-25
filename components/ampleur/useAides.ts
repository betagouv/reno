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

export const findAideLocale = (rules, engine) => {
  const candidates = Object.entries(rules).filter(
    ([dottedName]) =>
      dottedName.match(regexp) && dottedName.split(' . ').length === 3,
  )

  const found = candidates
    .map(([dottedName]) => engine.evaluate(dottedName))
    .find((evaluation) => evaluation.nodeValue > 0)

  console.log('lightbrown aides locales', {
    candidates,
    found,
  })
  if (!found) return {}
  try {
    return { name: capitalise0(found.dottedName.match(regexp)[1]), found }
  } catch (e) {
    console.error('Could not derive the name of the aide locale')
    return {}
  }
}
export function useAides(engine, situation) {
  const aides = list.map((aide) => {
    const evaluation = engine.setSituation(situation).evaluate(aide.dottedName)
    const value = formatValue(evaluation, { precision: 0 })
    console.log(
      'lightyellow useaides situation',
      engine.evaluate('copropriété . prime individuelle'),
    )

    const status = computeAideStatus(evaluation)
    const marque2 = aide.dottedName.startsWith('aides locales')
      ? findAideLocale(rules, engine).name
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
