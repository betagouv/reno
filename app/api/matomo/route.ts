const apiConfig = {
  token: process.env.MATOMO_API_TOKEN,
  funnelSimulateur: 192,
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
    } else if (type === 'apiEvents') {
      data = await getApiEventsWeekly()
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
  const { baseUrl, funnelSimulateur } = apiConfig

  const visitorData = await fetchMatomoData(
    `${baseUrl}&period=week&date=last9&method=VisitsSummary.get`,
  )

  const weekKeys = Object.keys(visitorData).sort()

  const [firstStart] = weekKeys[0].split(',')
  const [, lastEnd] = weekKeys[weekKeys.length - 1].split(',')

  const funnelDaily = await fetchMatomoData(
    `${baseUrl}&period=day&date=${firstStart},${lastEnd}&method=Funnels.getFunnelFlow&idFunnel=${funnelSimulateur}`,
  )

  const funnelWeekly = aggregateFunnelFlowDailyToWeeks(funnelDaily, weekKeys)

  const merged = {}
  for (const wk of weekKeys) {
    merged[wk] = {
      ...visitorData[wk],
      funnel: funnelWeekly[wk] ?? [],
    }
  }

  // On exclue la semaine actuelle pour ne pas dénaturer les stats
  const lastWeek = weekKeys[weekKeys.length - 1]
  delete merged[lastWeek]

  return merged
}

async function getLastMonthData() {
  const { baseUrl, funnelSimulateur } = apiConfig

  const data = await fetchMatomoData(
    `${baseUrl}&period=day&date=last31&method=Funnels.getFunnelFlow&idFunnel=${funnelSimulateur}`,
  )

  // On exclue le jours courant
  const today = new Date().toISOString().split('T')[0]
  delete data[today]

  return data
}

async function getInternalData(segment) {
  const { baseUrl, funnelSimulateur } = apiConfig

  const segmentQuery = getSegmentQuery(segment)
  const funnelData = await fetchMatomoData(
    `${baseUrl}&period=day&date=last31&method=Funnels.getFunnelFlow&idFunnel=${funnelSimulateur}${segmentQuery}`,
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
async function getApiEventsWeekly() {
  const { baseUrl } = apiConfig

  const raw = await fetchMatomoData(
    `${baseUrl}&period=week&date=last9&method=Events.getCategory&segment=eventCategory==API`,
  )

  const result: Record<string, number> = {}
  for (const [week, rows] of Object.entries(raw)) {
    const list = Array.isArray(rows) ? (rows as any[]) : []
    const apiRow = list.find((r) => r.label === 'API') || list[0]
    const nbEvents = apiRow ? Number(apiRow.nb_events) || 0 : 0
    result[week] = nbEvents
  }

  const lastWeekKey = Object.keys(result).pop()
  if (lastWeekKey) {
    delete result[lastWeekKey]
  }

  return result
}

function createFetchOptions(token) {
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

function aggregateFunnelFlowDailyToWeeks(dailyFlow, weekKeys) {
  const weekly = Object.fromEntries(weekKeys.map((k) => [k, []]))

  const weekRanges = weekKeys.map((k) => {
    const [start, end] = k.split(',')
    return { k, start, end }
  })

  const getWeekKey = (day) =>
    weekRanges.find((w) => w.start <= day && day <= w.end)?.k ?? null

  const sumRow = (acc, row) => {
    if (!acc) return { ...row }
    const out = { ...acc }

    for (const [k, v] of Object.entries(row)) {
      if (k === 'label') {
        out.label = out.label ?? v
        continue
      }

      out[k] = out[k] + v
    }
    return out
  }
  for (const [day, rows] of Object.entries(dailyFlow)) {
    const wk = getWeekKey(day)
    if (!wk) continue

    const accRows = weekly[wk] ?? []
    const next: any[] = []

    const list = Array.isArray(rows) ? rows : []
    for (let i = 0; i < list.length; i++) {
      next[i] = sumRow(accRows[i], list[i])
    }
    weekly[wk] = next
  }

  return weekly
}
