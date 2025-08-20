import { formatValue } from 'publicodes'

export const computeAideStatus = (evaluation) => {
  const value = formatValue(evaluation, { precision: 0 })

  if (value === 'Non applicable' || value === 'non') return false
  if (value === 'Pas encore défini' || evaluation.nodeValue === 0) return null
  if (evaluation.nodeValue > 0) return true
  const message = 'Unknown aide status, missing a case in the switch'
  console.error(message, evaluation.dottedName, value, evaluation)
  throw new Error(message)
}

export const createExampleSituation = (situation, type = 'normal') => {
  const exampleSituation = {
    ...situation,
    ...(type == 'best'
      ? {
          'projet . travaux': 999999,
          'projet . DPE visé': 1,
          'logement . type travaux': 'performance énergétique globale',
          'denormandie . années de location': 12,
        }
      : type == 'worst'
        ? {
            'projet . DPE visé': Math.max(
              (situation['DPE . actuel'] ? situation['DPE . actuel'] : 7) - 2,
              1,
            ),
            'denormandie . années de location': 6,
          }
        : {}),
    'taxe foncière . condition de dépenses': 'oui',
  }
  return exampleSituation
}

export const filterAidesToDisplay = (aides) =>
  aides.filter((aide) => {
    if (aide.status !== true && aide.baseDottedName !== 'MPR . accompagnée')
      return false
    return ![
      'ampleur . prime individuelle copropriété',
      'MPR . accompagnée . prise en charge MAR',
    ].includes(aide.baseDottedName)
  })
