import getAppUrl from '../getAppUrl'

export const extractCleanCodeInsee = (situation) => {
  const codeInseeRaw =
    situation['logement . commune'] || situation['ménage . commune']
  if (!codeInseeRaw) return situation
  const codeInsee = codeInseeRaw.replaceAll(/'/g, '').replaceAll('"', '')
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

const fetchGeo = async (path) => {
  const url = `/api/geo?path=${encodeURIComponent(path)}`
  const res = await fetch(url)
  return await res.json()
}

export async function getCommune(
  situation = null,
  type = null,
  codeCommune = null,
) {
  const path =
    lat != null && lon != null
      ? `communes?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      : codeCommune
        ? `communes/${codeCommune}`
        : situation &&
            type &&
            ['ménage . commune', 'logement . commune'].includes(type) &&
            situation[type]
          ? `communes/${situation[type].replace(/"/g, '').replace(/'/g, '')}`
          : null

  if (!path) return null
  return await fetchGeo(path)
}
