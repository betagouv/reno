import ort from '@/data/ort.csv'
import coeurDeVille from '@/data/coeur-de-ville.csv'

import communesTaxeFoncière from '@/data/exonération-taxe-foncière.csv'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const insee = searchParams.get('insee')
  const nom = searchParams.get('nom')

  const hasDenormandie =
    coeurDeVille.find((el) => el.insee_com == insee) ||
    ort.find((el) => el['Code commune'] == insee && el['Signée ?'] === 'Signée')

  const hasTaxeFoncière = communesTaxeFoncière.find((el) => el.code == insee),
    taxeFoncièreTaux =
      hasTaxeFoncière &&
      (hasTaxeFoncière.taux != null ? hasTaxeFoncière.taux : false)

  // Also set the name that will be used to explain the eligibilite
  console.log('HASTAXE', hasTaxeFoncière, insee)
  const foundName =
    !nom &&
    (hasDenormandie?.lib_com ||
      hasDenormandie?.Commune ||
      (hasTaxeFoncière && hasTaxeFoncière['Nom de la collectivité']))
  const eligibilite = {
    'logement . commune . denormandie': hasDenormandie ? 'oui' : 'non',
    ...(hasTaxeFoncière
      ? taxeFoncièreTaux
        ? {
            'taxe foncière . commune . éligible': 'oui',
            'taxe foncière . commune . taux': taxeFoncièreTaux,
          }
        : { 'taxe foncière . commune . éligible': 'oui' }
      : {}),
    ...(foundName
      ? {
          'logement . commune . nom': `"${foundName}"`,
        }
      : {}),
  }

  return Response.json(eligibilite)
}
