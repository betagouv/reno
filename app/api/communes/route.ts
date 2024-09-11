import ort from '@/data/ort.csv'
import coeurDeVille from '@/data/coeur-de-ville.csv'

import taxeFoncière from '@/app/règles/communes-taxe-foncière.yaml'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const insee = searchParams.get('insee')
  const nom = searchParams.get('nom')

  const hasDenormandie =
    coeurDeVille.find((el) => el.insee_com == insee) ||
    ort.find((el) => el['Code commune'] == insee && el['Signée ?'] === 'Signée')

  const hasTaxeFoncière = taxeFoncière.find((el) => el.commune === nom)
  const eligibilite = {
    'logement . commune . denormandie': hasDenormandie ? 'oui' : 'non',
    // Also set the name that will be used to explain the eligibilite
    ...(hasDenormandie
      ? {
          'logement . commune . nom': `"${
            hasDenormandie['lib_com'] || hasDenormandie['Commune']
          }"`,
        }
      : {}),
    //'logement . commune . taxe foncière': hasTaxeFoncière ? 'oui' : 'non',
  }

  return Response.json(eligibilite)
}
