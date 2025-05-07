import getAppUrl from '../getAppUrl'

export const extractCleanCodeInsee = (situation) => {
  const codeInseeRaw =
    situation['logement . commune'] || situation['ménage . commune']
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

// TODO this because I can't figure out an easy way to do this translation in publicodes ! It's only used by the /module for now
export const enrichSituationWithConstructionYear = (situation, engine) => {
  const year = situation['logement . année de construction']
  if (!year) return situation

  const period = engine
    .setSituation(situation)
    .evaluate('logement . période de construction calculée')

  if (!period.nodeValue) return situation
  return {
    ...situation,
    'logement . période de construction': `"${period.nodeValue}"`,
  }
}

export async function getCommune(situation, type) {
  if (
    situation &&
    ['ménage . commune', 'logement . commune'].includes(type) &&
    situation[type]
  ) {
    const path = `communes?code=${situation[type].replace(/"/g, '').replace(/'/g, '')}`,
      url = `${getAppUrl()}/api/geo/?path=${encodeURIComponent(path)}`

    const response = await fetch(url)
    const json = await response.json()
    return json[0]
  }
  return null
}
