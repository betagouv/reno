export const getRuleName = (dottedName) => dottedName.split(' . ').slice(-1)[0]

export const parentName = (dottedName) =>
  dottedName.split(' . ').slice(0, -1).join(' . ')
