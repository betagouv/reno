import getAppUrl from '../getAppUrl'

export const extractCleanCodeInsee = (situation) => {
  const codeInseeRaw = situation['logement . commune']
  if (!codeInseeRaw) return situation
  const codeInsee = codeInseeRaw.replace(/'/g, '')
  return codeInsee
}

export default async function enrichSituation(situation) {
  const codeInsee = extractCleanCodeInsee(situation)
  const url = getAppUrl() + `/api/communes?insee=${codeInsee}`
  const request = await fetch(url)
  const éligibilité = await request.json()
  return { ...situation, ...éligibilité }
}
