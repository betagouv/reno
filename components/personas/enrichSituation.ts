import getAppUrl from '../getAppUrl'

export const extractCleanCodeInsee = (situation) => {
  const codeInseeRaw =
    situation['logement . commune'] || situation['ménage . commune']
  if (!codeInseeRaw) return situation
  const codeInsee = codeInseeRaw.toString().replace(/'/g, '')
  return codeInsee
}

export default async function enrichSituation(situation) {
  const codeInsee = extractCleanCodeInsee(situation)
  const url = getAppUrl() + `/api/communes?insee=${codeInsee}`
  const request = await fetch(url)
  const éligibilité = await request.json()
  return { ...situation, ...éligibilité }
}

export async function getCommune(situation, type) {
  if (
    situation &&
    ['ménage . commune', 'logement . commune'].includes(type) &&
    situation[type]
  ) {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?code=${situation[type].toString().replace(/"/g, '')}`,
    )
    const json = await response.json()

    return json[0]
  }
  return null
}
