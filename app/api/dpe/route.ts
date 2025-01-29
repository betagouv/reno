export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const response = await fetch(
    'https://observatoire-dpe-audit.ademe.fr/pub/dpe/' +
      searchParams.get('numDpe') +
      '/xml',
  )
  const data = await response.text()
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
