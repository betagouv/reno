import rules from '@/app/règles/rules'
import { capitalise0, formatValue } from 'publicodes'
import { computeAideStatus } from './AmpleurSummary'

const regexp = /aides locales \. (.+) \. montant$/

export const findAidesLocales = (rules, engine) => {
  const candidates = Object.entries(rules).filter(
    ([dottedName, rule]) => dottedName.match(regexp) && rule.remplace,
  )

  const found = candidates
    .map(([dottedName]) => engine.evaluate(dottedName))
    .filter(
      (evaluation) =>
        evaluation.nodeValue > 0 || evaluation.nodeValue === false,
    )

  try {
    return found.map((evaluation) => {
      const aideLocalePart = evaluation.dottedName.match(regexp)[1]
      const place = aideLocalePart.split(' . ')[0]
      const rule = rules[evaluation.dottedName],
        titre = rule.titre,
        name = capitalise0(
          `${place} ${titre ? ` : ${rule.titre}` : ''}` ||
            aideLocalePart.split(' . ').join(' - '),
        )
      return {
        ...evaluation,
        name,
        level: rules[evaluation.dottedName].remplace,
      }
    })
  } catch (e) {
    console.error('Could not derive the name of the aide locale')
    return []
  }
}

export function useAides(
  engine,
  situation,
  parcoursAide = 'rénovation énergétique',
) {
  const topList =
    parcoursAide == 'rénovation énergétique'
      ? [...rules['ampleur . tous les dispositifs'].somme]
      : [
          'mpa . montant',
          'locavantage . montant',
          'tva réduite',
          "crédit d'impôt . montant",
          'aides locales',
        ]
  // unfold the sums with one level only, no recursion yet
  const list = topList
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

  const aides = list.map((aide) => {
    const cond = aide.dottedName.replace('montant', 'condition éligibilité')
    const evaluation = engine
      .setSituation(situation)
      .evaluate(rules[cond] ? cond : aide.dottedName)

    const marque2 = aide.dottedName.startsWith('aides locales')
      ? findAidesLocales(rules, engine)
          .map((aide) => aide.name)
          .join(', ')
      : aide['complément de marque']

    return {
      ...aide,
      evaluation,
      value: formatValue(evaluation, { precision: 0 }),
      status: computeAideStatus(evaluation),
      'complément de marque': marque2,
    }
  })
  return aides
}
