import denormandie from '@/app/règles/communes-denormandie.yaml'
import taxeFoncière from '@/app/règles/communes-taxe-foncière.yaml'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const insee = searchParams.get('insee')
  const nom = searchParams.get('nom')

  const eligibilite = {
    denormandie: denormandie.find((el) => el.insee === insee) != null,
    taxeFoncière: taxeFoncière.find((el) => el.commune === nom) != null,
  }

  return Response.json(eligibilite)
}
