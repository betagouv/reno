import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

// Réglages
const TILE_DEG = 0.5  
const OUT_DIR = path.join(process.cwd(), 'data', 'copro_tiles')

function toNum(v) {
  if (v == null) return null
  const s = String(v).trim().replace(',', '.')
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function parsePoint(lat_lon) {
  if (!lat_lon) return { lon: null, lat: null }
  const m = String(lat_lon).trim().match(/POINT\(([^ ]+)\s+([^)]+)\)/i)
  if (!m) return { lon: null, lat: null }
  return { lon: toNum(m[1]), lat: toNum(m[2]) }
}

function tileKey(lat, lon) {
  const iLat = Math.floor(lat / TILE_DEG)
  const iLon = Math.floor(lon / TILE_DEG)
  return `${iLat}_${iLon}`
}

const streams = new Map() 
let tick = 0

function getStream(key) {
  tick++

  const existing = streams.get(key)
  if (existing) {
    existing.lastUsed = tick
    return existing.ws
  }

  if (streams.size >= 64) {
    let lruKey = null
    let lruTick = Infinity
    for (const [k, v] of streams.entries()) {
      if (v.lastUsed < lruTick) {
        lruTick = v.lastUsed
        lruKey = k
      }
    }
    if (lruKey) {
      streams.get(lruKey).ws.end()
      streams.delete(lruKey)
    }
  }

  const file = path.join(OUT_DIR, `${key}.ndjson`)
  const ws = fs.createWriteStream(file, { flags: 'a', encoding: 'utf8' })
  streams.set(key, { ws, lastUsed: tick })
  return ws
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const inPath = path.join(process.cwd(), 'data/copro-geo.csv')
  if (!inPath) {
    console.error('Fichier copro-geo.csv introuvable.')
    process.exit(1)
  }

  const tiles = new Set()
  let total = 0
  let kept = 0

  await new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inPath, { encoding: 'utf8' })

    Papa.parse(readStream, {
      header: true,
      skipEmptyLines: true,
      step: (results) => {
        total++
        const r = results.data || {}

        let lon = toNum(r['long'] ?? r['lon'])
        let lat = toNum(r['lat'])

        if (lat == null || lon == null) {
          const p = parsePoint(r['lat_lon'] ?? r['latLon'] ?? r['lat_lon_point'])
          lon ??= p.lon
          lat ??= p.lat
        }

        if (lat == null || lon == null) return
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return

        const out = {
          id: r["Numéro d'immatriculation"] ?? r["Numéro d'immatriculation"] ?? r["id"] ?? null,
          adresse: r["Nom d’usage de la copropriété"] ?? null,
          codeCommune: r["Commune"] ?? null,
          nomCommune: r["Nom Officiel Commune"] ?? null,
          codeDep: r["Code Officiel Département"] ?? null,
          codeReg: r["Code Officiel Région"] ?? null,
          epci: r["Code Officiel EPCI"] ?? null,
          lotsTotal: r["Nombre total de lots à usage d’habitation, de bureaux ou de commerces"] ?? null,
          lotsHab: r["Nombre de lots à usage d’habitation"] ?? null,
          periode: r["Période de construction"] ?? null,
          lat_d: lat,
          lon_d: lon,
        }

        const key = tileKey(lat, lon)
        tiles.add(key)

        const ws = getStream(key)
        ws.write(JSON.stringify(out) + '\n')
        kept++
      },
      complete: () => resolve(),
      error: (err) => reject(err),
    })
  })

  for (const { ws } of streams.values()) ws.end()

  const meta = {
    version: 1,
    tile_deg: TILE_DEG,
    tiles: Array.from(tiles),
    total_rows_processed: total,
    rows_kept: kept,
  }

  fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
