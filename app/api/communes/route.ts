import denormandie from '@/app/règles/communes-denormandie.yaml'
import taxeFoncière from '@/app/règles/communes-taxe-foncière.yaml'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const insee = searchParams.get('insee')
  const nom = searchParams.get('nom')

  const hasDenormandie = denormandie.find((el) => el.insee === insee) != null
  const hasTaxeFoncière = taxeFoncière.find((el) => el.commune === nom) != null
  const eligibilite = {
    'logement . commune . denormandie': hasDenormandie ? 'oui' : 'non',
    //'logement . commune . taxe foncière': hasTaxeFoncière ? 'oui' : 'non',
  }

  return Response.json(eligibilite)
}
