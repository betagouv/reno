export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const apiToken = process.env.MATOMO_API_TOKEN
  const idSite = '101'
  const startDate = '2024-08-15'
  const idFunnel = 122
  const baseUrl = `https://stats.beta.gouv.fr/?module=API&idSite=${idSite}&period=week&date=last9&format=JSON`
  const matomoUrlFunnel =
    baseUrl + `&method=Funnels.getFunnelFlow&idFunnel=${idFunnel}`

  const matomoUrlVisitor = baseUrl + `&method=VisitsSummary.get`
  const matomoUrlEvents =
    baseUrl + `&period=range&date=${startDate},today&method=Events.getName`

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
    let data
    if (type == 'events') {
      data = (await fetchMatomoData(matomoUrlEvents, options))
        .filter((elt) => ['Oui', 'Non', 'En partie'].includes(elt.label))
        .reduce((acc, curr) => {
          acc[curr.label.toLowerCase()] = curr.sum_daily_nb_uniq_visitors
          return acc
        }, {})
      const total = Object.values(data).reduce((acc, curr) => {
        return acc + curr
      }, 0)
      data.oui = Math.round((data.oui / total) * 100)
      data['en partie'] = Math.round((data['en partie'] / total) * 100)
      // Pour être sûr d'être à 100% et pas 99% avec les arrondis
      data.non = 100 - (data.oui + data['en partie'])
    } else if (type == 'visitors') {
      const dataFunnel = await fetchMatomoData(matomoUrlFunnel, options)
      const dataVisitor = await fetchMatomoData(matomoUrlVisitor, options)
      data = mergeData(dataFunnel, dataVisitor)

      // On enlève la semaine en cours pour ne pas avoir de données partielles qui dénature le graph
      const lastWeek = Object.keys(data).pop()
      delete data[lastWeek]
    } else if (type == 'lastMonth') {
      data = await fetchMatomoData(
        matomoUrlFunnel + '&period=day&date=last30',
        options,
      )
    }

    return new Response(JSON.stringify(data), {
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
function mergeData(data, dataVisitor) {
  const merged = {}

  Object.entries(data).forEach(([funnelDateRange, funnelData]) => {
    merged[funnelDateRange] = {
      ...funnelData,
      ...dataVisitor[funnelDateRange],
    }
  })

  return merged
}
