export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dpeNumber = searchParams.get('dpeNumber')
  if (!dpeNumber) {
    return new Response(
      JSON.stringify({
        status: 'Pas de DPE',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  }

  const url = `https://observatoire-dpe-audit.ademe.fr/pub/dpe/${dpeNumber}/xml`

  try {
    const response = await fetch(url, { mode: 'no-cors' })
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

    const blob = await response.blob()
    const buffer = await blob.arrayBuffer()
    return new Response(Buffer.from(buffer), {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
