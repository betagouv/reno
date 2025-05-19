export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  if (!lat || !lon) {
    return new Response(
      JSON.stringify({
        status: 'Pas de coordonnées géographiques',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  }

  const response = await fetch(
    `https://france-chaleur-urbaine.beta.gouv.fr/api/v1/eligibility?lat=${lat}&lon=${lon}`,
  )
  if (!response.ok) {
    return new Response(
      JSON.stringify({
        error: response.ok,
        status: response.status,
        statusText: response.statusText,
      }),
      {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  return Response.json(await response.json())
}
