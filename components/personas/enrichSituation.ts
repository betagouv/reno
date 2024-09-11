import getAppUrl from '../getAppUrl'

export default async function enrichSituation(situation) {
  const codeInsee = situation['logement . commune']
  if (!codeInsee) return situation
  const url = getAppUrl() + `/api/communes?insee=${codeInsee}`
  const request = await fetch(url)
  const éligibilité = await request.json()
  return { ...situation, ...éligibilité }
}
