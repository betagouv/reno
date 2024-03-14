export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const codeInsee = searchParams.get('codeInsee')

  const bodyFormData = new FormData()
  bodyFormData.append('insee', codeInsee)
  const externalRequest = await fetch(
    'https://france-renov.gouv.fr/espaces-conseil-fr/search.json',
    {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'x-requested-with': 'XMLHttpRequest',
      },
      referrer:
        'https://france-renov.gouv.fr/annuaire-ar/recherche?localisation=35000+-+Rennes&insee=35238',
      body: bodyFormData,
      method: 'POST',
    },
  )
  if (!externalRequest.ok) console.log(externalRequest)
  const data = await externalRequest.json()

  return Response.json(data)
}
