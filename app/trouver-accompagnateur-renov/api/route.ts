const boundary = `123457`

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const codePostal = searchParams.get('codePostal')
  const codeInsee = searchParams.get('codeInsee')

  const body = `-----------------------------${boundary}\r\nContent-Disposition: form-data; name=\"localisation\"\r\n\r\n${codePostal} - Rennes\r\n-----------------------------${boundary}\r\nContent-Disposition: form-data; name=\"insee\"\r\n\r\n${codeInsee}\r\n-----------------------------${boundary}--\r\n`

  const externalRequest = await fetch(
    'https://france-renov.gouv.fr/annuaire-ar/search.json',
    {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'x-requested-with': 'XMLHttpRequest',
        'Content-Type': `multipart/form-data; boundary=---------------------------${boundary}`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
      referrer:
        'https://france-renov.gouv.fr/annuaire-ar/recherche?localisation=35000+-+Rennes&insee=35238',
      body,
      method: 'POST',
      mode: 'cors',
    },
  )
  const data = await externalRequest.json()

  return Response.json(data)
}
