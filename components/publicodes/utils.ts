import { capitalise0 } from '../utils'

export const getRuleName = (dottedName) =>
  capitalise0(dottedName.split(' . ').slice(-1)[0])

export const parentName = (dottedName) =>
  dottedName.split(' . ').slice(0, -1).join(' . ')

export const getRuleTitle = (dottedName, rules) => {
  const rule = rules[dottedName]
  if (!rule) return getRuleName(dottedName)
  const { titreHtml, titre } = rule
  if (titreHtml) return titreHtml
  if (titre) return titre

  return getRuleName(dottedName)
}
