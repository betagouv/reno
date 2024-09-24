import ort from '@/data/ort.csv'
import coeurDeVille from '@/data/coeur-de-ville.csv'
import communesTaxeFoncière from '@/data/exonération-taxe-foncière-population.csv'

export function buildEligilityObject(insee, nom = null) {
  const hasDenormandie =
    coeurDeVille.find((el) => el.insee_com == insee) ||
    ort.find((el) => el['Code commune'] == insee && el['Signée ?'] === 'Signée')

  const hasTaxeFoncière = communesTaxeFoncière.find((el) => el.code == insee),
    taxeFoncièreTaux = hasTaxeFoncière ? hasTaxeFoncière.taux : null

  // Also set the name that will be used to explain the eligibilite
  const foundName =
    !nom &&
    (hasDenormandie?.lib_com ||
      hasDenormandie?.Commune ||
      (hasTaxeFoncière && hasTaxeFoncière['Nom de la collectivité']))

  const eligibility = {
    'logement . commune . denormandie': hasDenormandie ? 'oui' : 'non',
    'taxe foncière . commune . éligible': hasTaxeFoncière ? 'oui' : 'non',
    ...(hasTaxeFoncière
      ? {
          'taxe foncière . commune . taux': taxeFoncièreTaux + ' %',
        }
      : {}),
    ...(foundName
      ? {
          'logement . commune . nom': `"${foundName}"`,
        }
      : {}),
  }

  return eligibility
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const insee = searchParams.get('insee')
  const nom = searchParams.get('nom')

  const eligibility = buildEligilityObject(insee, nom)

  return Response.json(eligibility)
}
