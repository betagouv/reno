import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TILES_DIR = path.join(process.cwd(), 'data', 'copro_tiles')
const MAX_RADIUS = 12

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

async function loadMeta() {
  const g = globalThis
  if (g.__coproMeta) return g.__coproMeta
  if (g.__coproMetaPromise) return g.__coproMetaPromise

  g.__coproMetaPromise = (async () => {
    const metaPath = path.join(TILES_DIR, 'meta.json')
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    g.__coproMeta = meta
    g.__coproTileSet = new Set(meta.tiles)
    if (!g.__coproTileCache) g.__coproTileCache = new Map()
    if (!g.__coproTileCacheTick) g.__coproTileCacheTick = 0
    return meta
  })().catch((err) => {
    delete (globalThis as G).__coproMetaPromise
    throw err
  })

  return g.__coproMetaPromise
}

function touchTileCache(key: string) {
  const g = globalThis
  g.__coproTileCacheTick = (g.__coproTileCacheTick ?? 0) + 1
  const tick = g.__coproTileCacheTick
  const cache = g.__coproTileCache!

  const entry = cache.get(key)
  if (entry) entry.lastUsed = tick

  if (cache.size > 60) {
    let lruKey = null
    let lruTick = Infinity
    for (const [k, v] of cache.entries()) {
      if (v.lastUsed < lruTick) {
        lruTick = v.lastUsed
        lruKey = k
      }
    }
    if (lruKey) cache.delete(lruKey)
  }
}

async function loadTile(key) {
  const g = globalThis
  const cache = g.__coproTileCache!

  const cached = cache.get(key)
  if (cached) {
    touchTileCache(key)
    return cached.rows
  }

  const file = path.join(TILES_DIR, `${key}.ndjson`)
  const rows = []

  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const s = line.trim()
    if (!s) continue
    const obj = JSON.parse(s)
    if (typeof obj.lat_d !== 'number' || typeof obj.lon_d !== 'number') continue
    if (!Number.isFinite(obj.lat_d) || !Number.isFinite(obj.lon_d)) continue
    rows.push(obj)
  }

  cache.set(key, { rows, lastUsed: 0 })
  touchTileCache(key)
  return rows
}

function tileKey(lat, lon, tileDeg) {
  const iLat = Math.floor(lat / tileDeg)
  const iLon = Math.floor(lon / tileDeg)
  return { iLat, iLon, key: `${iLat}_${iLon}` }
}

function ringKeys(iLat, iLon, r) {
  const keys = []
  for (let dLat = -r; dLat <= r; dLat++) {
    for (let dLon = -r; dLon <= r; dLon++) {
      if (r > 0 && Math.abs(dLat) !== r && Math.abs(dLon) !== r) continue
      keys.push(`${iLat + dLat}_${iLon + dLon}`)
    }
  }
  return keys
}

function topKNearest(rows, lat, lon, k) {
  const best = []

  for (const r of rows) {
    const d = haversineMeters(lat, lon, r.lat_d, r.lon_d)

    if (best.length < k) {
      best.push({ row: r, d })
      continue
    }

    let worstIdx = 0
    for (let i = 1; i < best.length; i++) {
      if (best[i].d > best[worstIdx].d) worstIdx = i
    }
    if (d < best[worstIdx].d) best[worstIdx] = { row: r, d }
  }

  best.sort((a, b) => a.d - b.d)
  return best.map((x) => ({ ...x.row, distance_m: x.d }))
}

export async function GET(req: Request, ctx: { params }) {
  const { lat, long } = await ctx.params

  const latN = Number(lat)
  const lonN = Number(long)
  const limitN = 6

  if (
    !Number.isFinite(latN) ||
    latN < -90 ||
    latN > 90 ||
    !Number.isFinite(lonN) ||
    lonN < -180 ||
    lonN > 180
  ) {
    return Response.json({ error: 'Invalid params' }, { status: 400 })
  }

  try {
    const meta = await loadMeta()
    const tileDeg = meta.tile_deg
    const tileSet = globalThis.__coproTileSet!

    const { iLat, iLon } = tileKey(latN, lonN, tileDeg)

    const candidates = []

    for (let r = 0; r <= 12; r++) {
      const keys = ringKeys(iLat, iLon, r)

      for (const k of keys) {
        if (!tileSet.has(k)) continue
        const rows = await loadTile(k)
        candidates.push(...rows)
      }

      if (candidates.length >= 800 && r >= 1) break
    }

    if (candidates.length === 0) return Response.json([])

    const ranked = topKNearest(candidates, latN, lonN, limitN)
    return Response.json(ranked)
  } catch (err) {
    console.error(err)
    return Response.json(
      { error: 'Failed to query copro tiles' },
      { status: 500 },
    )
  }
}
