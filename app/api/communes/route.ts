import ort from '@/data/ort.csv'
import coeurDeVille from '@/data/coeur-de-ville.csv'

import taxeFoncière from '@/app/règles/communes-taxe-foncière.yaml'

console.log(ort.find((el) => el.Commune.includes('Brest')))

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
    //'logement . commune . taxe foncière': hasTaxeFoncière ? 'oui' : 'non',
  }

  return Response.json(eligibilite)
}
