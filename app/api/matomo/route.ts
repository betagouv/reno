export async function GET() {
  const apiToken = process.env.MATOMO_API_TOKEN
  const idSite = '101'
  const startDate = '2024-08-15'
  const idFunnel = 122
  const baseUrl = `https://stats.beta.gouv.fr/?module=API&idSite=${idSite}&period=week&date=last9&format=JSON`
  const matomoUrlFunnel =
    baseUrl + `&method=Funnels.getFunnelFlow&idFunnel=${idFunnel}`

  const matomoUrlVisitor = baseUrl + `&method=VisitsSummary.get`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token_auth: apiToken,
      date: startDate,
    }),
  }

  try {
    const data = await fetchMatomoData(matomoUrlFunnel, options)
    const dataVisitor = await fetchMatomoData(matomoUrlVisitor, options)
    const mergedData = mergeDataFunnelAndVisitor(data, dataVisitor)

    // On enlève la semaine en cours pour ne pas avoir de données partielles qui dénature le graph
    const lastWeek = Object.keys(mergedData).pop()
    delete mergedData[lastWeek]

    return new Response(JSON.stringify(mergedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

async function fetchMatomoData(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des données Matomo: ${url}`)
  }
  return response.json()
}
function mergeDataFunnelAndVisitor(data, dataVisitor) {
  const merged = {}

  Object.entries(data).forEach(([funnelDateRange, funnelData]) => {
    merged[funnelDateRange] = {
      ...funnelData,
      ...dataVisitor[funnelDateRange],
    }
  })

  return merged
}
