const apiConfig = {
  token: process.env.MATOMO_API_TOKEN,
  funnels: {
    simulateur: 122,
    module: 127,
  },
  baseUrl: 'https://stats.beta.gouv.fr/?module=API&idSite=101&format=JSON',
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    let data
    if (type === 'events') {
      data = await getEventData()
    } else if (type === 'visitors') {
      data = await getVisitorData()
    } else if (type === 'lastMonth') {
      data = await getLastMonthData()
    } else if (type === 'internes') {
      data = await getInternalData(searchParams.get('segment'))
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function fetchMatomoData(url) {
  const options = createFetchOptions(apiConfig.token)

  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`Error fetching Matomo data from: ${url}`)
  }
  return response.json()
}

async function getEventData() {
  const { baseUrl } = apiConfig
  const today = new Date()
  const startDate = new Date(new Date().setDate(today.getDate() - 30))
  const data = await Promise.all(
    [40, 41, 42].map((idGoal) =>
      fetchMatomoData(
        `${baseUrl}&period=week&date=${startDate.toISOString().split('T')[0]},today&method=Goals.get&idGoal=${idGoal}`,
      ),
    ),
  )
  const [dataOui, dataEnPartie, dataNon] = data.map(
    (goal) =>
      Object.values(goal)
        .map((dataGoal) => dataGoal.nb_conversions)
        .reduce((p, acc) => p + acc) || 0,
  )
  const total = dataOui + dataEnPartie + dataNon || 1

  return {
    oui: Math.round((dataOui / total) * 100),
    'en partie': Math.round((dataEnPartie / total) * 100),
    non:
      100 -
      Math.round((dataOui / total) * 100) -
      Math.round((dataEnPartie / total) * 100),
  }
}

async function getVisitorData() {
  const { baseUrl, funnels } = apiConfig
  const funnelData = await fetchMatomoData(
    `${baseUrl}&period=week&date=last9&method=Funnels.getFunnelFlow&idFunnel=${funnels.simulateur}`,
  )

  const visitorData = await fetchMatomoData(
    `${baseUrl}&period=week&date=last9&method=VisitsSummary.get`,
  )

  const mergedData = mergeData(funnelData, visitorData)
  // On exclue la semaine actuelle pour ne pas dénaturer les stats
  const lastWeek = Object.keys(mergedData).pop()
  delete mergedData[lastWeek]

  return mergedData
}

async function getLastMonthData() {
  const { baseUrl, funnels } = apiConfig

  const data = await fetchMatomoData(
    `${baseUrl}&period=day&date=last31&method=Funnels.getFunnelFlow&idFunnel=${funnels.simulateur}`,
  )

  // On exclue le jours courant
  const today = new Date().toISOString().split('T')[0]
  delete data[today]

  return data
}

async function getInternalData(segment) {
  const { baseUrl, funnels } = apiConfig

  const segmentQuery = getSegmentQuery(segment)
  const funnelId = segment === 'module' ? funnels.module : funnels.simulateur

  const funnelData = await fetchMatomoData(
    `${baseUrl}&period=day&date=last31&method=Funnels.getFunnelFlow&idFunnel=${funnelId}${segmentQuery}`,
  )
  const visitorData = await fetchMatomoData(
    `${baseUrl}&period=day&date=last31&method=VisitsSummary.get${segmentQuery}`,
  )

  const mergedData = mergeData(funnelData, visitorData)

  // On exclue le jours courant
  const lastDay = Object.keys(mergedData).pop()
  delete mergedData[lastDay]

  return mergedData
}

function createFetchOptions(token, date) {
  let formData = new FormData()
  formData.append('token_auth', token)
  return {
    method: 'POST',
    body: formData,
  }
}

function getSegmentQuery(segment) {
  if (!segment) return ''
  switch (segment) {
    case 'iframe':
      return '&segment=eventCategory==Iframe'
    case 'site':
      return '&segment=eventCategory!=Iframe'
    case 'module':
      return '&segment=eventCategory==Module'
    default:
      return ''
  }
}

function mergeData(data, visitorData) {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = { ...value, ...visitorData[key] }
    return acc
  }, {})
}
