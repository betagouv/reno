import { capitalise0 } from '../utils'

export const getRuleName = (dottedName) =>
  capitalise0(dottedName.split(' . ').slice(-1)[0])

export const parentName = (dottedName) =>
  dottedName.split(' . ').slice(0, -1).join(' . ')

export const getRuleTitle = (dottedName, rules) => {
  const rule = rules[dottedName]
  if (!rule) return getRuleName(dottedName)
  const { titre } = rule
  if (titre) return titre

  return getRuleName(dottedName)
}

export const textValueEquality = (value, test) => {
  if (!value) return false

  if (value.startsWith('"') && value.endsWith('"'))
    return value.replace(/\"/g, '') === test
  if (value.startsWith("'") && value.endsWith("'"))
    return value.replace(/\'/g, '') === test

  throw Error(
    'Cette valeur publicodes ne semble pas être de type texte, elle serait entourée de " ou de \'',
  )
}
