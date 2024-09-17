import ort from '@/data/ort.csv'
import coeurDeVille from '@/data/coeur-de-ville.csv'

import communesTaxeFoncière from '@/app/règles/communes-taxe-foncière.yaml'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const insee = searchParams.get('insee')
  const nom = searchParams.get('nom')

  const hasDenormandie =
    coeurDeVille.find((el) => el.insee_com == insee) ||
    ort.find((el) => el['Code commune'] == insee && el['Signée ?'] === 'Signée')

  const hasTaxeFoncière = communesTaxeFoncière.find(
      (el) => el.code && el.code == insee,
    ),
    // Si pas de taux renseigné, nous prenons le taux le moins positif, 50 %
    taxeFoncière = hasTaxeFoncière ? (hasTaxeFoncière.taux ?? '50 %') : '0'
  // Also set the name that will be used to explain the eligibilite
  console.log('HASTAXE', hasTaxeFoncière, insee)
  const foundName =
    !nom &&
    (hasDenormandie?.lib_com ||
      hasDenormandie?.Commune ||
      hasTaxeFoncière?.commune)
  const eligibilite = {
    'logement . commune . denormandie': hasDenormandie ? 'oui' : 'non',
    'taux taxe foncière commune': taxeFoncière,
    ...(foundName
      ? {
          'logement . commune . nom': `"${foundName}"`,
        }
      : {}),
  }

  return Response.json(eligibilite)
}
