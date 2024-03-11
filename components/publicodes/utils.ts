import { capitalise0 } from '../utils'

export const getRuleName = (dottedName) =>
  capitalise0(dottedName.split(' . ').slice(-1)[0])

export const parentName = (dottedName) =>
  dottedName.split(' . ').slice(0, -1).join(' . ')

export const getRuleTitle = (dottedName, rules) => {
  const rule = rules[dottedName]
  const title = rule.titre
  if (title) return title

  return getRuleName(dottedName)
}
