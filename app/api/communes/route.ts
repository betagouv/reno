import ort from '@/data/ort.csv'
import coeurDeVille from '@/data/coeur-de-ville.csv'
import communesTaxeFonciere from '@/data/exoneration_taxe_fonciere_population.csv'

export function buildEligilityObject(insee, nom = null) {
  const hasDenormandie =
    coeurDeVille.find((el) => el.insee_com == insee) ||
    ort.find((el) => el['Code commune'] == insee && el['Signée ?'] === 'Signée')

  const hasTaxeFonciere = communesTaxeFonciere.find((el) => el.codeInsee == insee),
    taxeFonciereTaux = hasTaxeFonciere ? hasTaxeFonciere.taux : null

  // Also set the name that will be used to explain the eligibilite
  const foundName =
    !nom &&
    (hasDenormandie?.lib_com ||
      hasDenormandie?.Commune ||
      (hasTaxeFonciere && hasTaxeFonciere['nomCollectivite']))

  const eligibility = {
    'logement . commune . denormandie': hasDenormandie ? 'oui' : 'non',
    'taxe foncière . commune . éligible': hasTaxeFonciere ? 'oui' : 'non',
    ...(hasTaxeFonciere
      ? {
          'taxe foncière . commune . taux': taxeFonciereTaux + ' %',
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
