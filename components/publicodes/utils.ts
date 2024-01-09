import { capitalise0 } from '../utils'

export const getRuleName = (dottedName) =>
  capitalise0(dottedName.split(' . ').slice(-1)[0])

export const parentName = (dottedName) =>
  dottedName.split(' . ').slice(0, -1).join(' . ')
