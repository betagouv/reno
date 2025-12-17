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

export const enrichSituationWithLatLon = async (situationParams) => {
  const lat = situationParams?.lat
  const lon = situationParams?.lon
  if (lat == null || lon == null) return situationParams

  // Ne rien faire si déjà renseigné
  const existingCodeInsee =
    situationParams['logement . commune'] || situationParams['ménage . commune']
  if (existingCodeInsee) return situationParams

  try {
    const communeJson = await getCommune(null, null, null, lat, lon)
    const commune = Array.isArray(communeJson) ? communeJson?.[0] : communeJson
    const codeInsee = commune?.code
    if (!codeInsee) return situationParams
    const situationWithCommune = {
      'logement . commune': `"${codeInsee}"*`,
      'logement . code région': `"${commune.codeRegion}"*`,
      'logement . code département': `"${commune.codeDepartement}"*`,
      'logement . EPCI': `"${commune.codeEpci}"*`,
      'logement . commune . nom': `"${commune.nom}"*`,
    }

    return await enrichSituation(situationWithCommune)
  } catch (e) {
    console.error('enrichSituationWithLatLon failed', e)
    return situationParams
  }
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
  lat = null,
  lon = null,
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
