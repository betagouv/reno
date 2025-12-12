import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const duckdb = require('duckdb') as typeof import('duckdb')

export const runtime = 'nodejs'

BigInt.prototype.toJSON = function () {
  return Number(this)
}

type DuckDbGlobal = typeof globalThis & {
  __coproDbPromise?: Promise<import('duckdb').Database>
}

function run(db: import('duckdb').Database, sql: string, params?: any[]) {
  return new Promise<void>((resolve, reject) => {
    const cb = (err: any) => (err ? reject(err) : resolve())
    if (params && params.length > 0) db.run(sql, params, cb)
    else db.run(sql, cb)
  })
}

export function all<T = any>(
  db: import('duckdb').Database,
  sql: string,
  params?: any[],
) {
  return new Promise<T[]>((resolve, reject) => {
    const cb = (err: any, rows: T[]) => (err ? reject(err) : resolve(rows))
    if (params && params.length > 0) db.all(sql, params, cb)
    else db.all(sql, cb)
  })
}

export async function getCoproDb(): Promise<import('duckdb').Database> {
  const g = globalThis as DuckDbGlobal
  if (!g.__coproDbPromise) {
    g.__coproDbPromise = (async () => {
      const db = new duckdb.Database(':memory:')

      const csvPath = path.join(process.cwd(), 'copro-geo.csv')
      const csv = csvPath.replaceAll('\\', '/').replaceAll("'", "''")

      await run(
        db,
        `
        CREATE TABLE IF NOT EXISTS copro AS
        SELECT *
        FROM read_csv_auto('${csv}');
        `,
      )

      // On garde un champ "lat_lon_point" pour compat (mais en string)
      await run(
        db,
        `ALTER TABLE copro ADD COLUMN IF NOT EXISTS lat_lon_point VARCHAR;`,
      )
      await run(
        db,
        `UPDATE copro SET lat_lon_point = lat_lon WHERE lat_lon_point IS NULL;`,
      )

      // ✅ Colonnes numériques (sans spatial)
      await run(db, `ALTER TABLE copro ADD COLUMN IF NOT EXISTS lon_d DOUBLE;`)
      await run(db, `ALTER TABLE copro ADD COLUMN IF NOT EXISTS lat_d DOUBLE;`)

      // lat_lon est du style "POINT(<lon> <lat>)" => on extrait lon/lat
      await run(
        db,
        `
  UPDATE copro
  SET
    lon_d = COALESCE(
      TRY_CAST("long" AS DOUBLE),
      TRY_CAST(
        REPLACE(
          regexp_extract(NULLIF(TRIM(lat_lon), ''), 'POINT\\\\(([^ ]+) ([^\\\\)]+)\\\\)', 1),
          ',', '.'
        ) AS DOUBLE
      )
    ),
    lat_d = COALESCE(
      TRY_CAST("lat" AS DOUBLE),
      TRY_CAST(
        REPLACE(
          regexp_extract(NULLIF(TRIM(lat_lon), ''), 'POINT\\\\(([^ ]+) ([^\\\\)]+)\\\\)', 2),
          ',', '.'
        ) AS DOUBLE
      )
    )
  WHERE lon_d IS NULL OR lat_d IS NULL;
  `,
      )

      return db
    })().catch((err) => {
      delete (globalThis as DuckDbGlobal).__coproDbPromise
      throw err
    })
  }
  return g.__coproDbPromise
}
