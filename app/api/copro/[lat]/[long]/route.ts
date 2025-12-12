import { getCoproDb, all } from '../../_db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, ctx: any) {
  const { lat, long } = await ctx.params
  try {
    const db = await getCoproDb()

    const latN = Number(lat)
    const lonN = Number(long)

    if (!Number.isFinite(latN) || !Number.isFinite(lonN)) {
      return Response.json({ error: 'Invalid params' }, { status: 400 })
    }

    const rows = await all(
      db,
      `
      WITH p AS (SELECT ${latN}::DOUBLE AS lat, ${lonN}::DOUBLE AS lon)
      SELECT
        copro.*,
        (
          2 * 6371000 * ASIN(
            SQRT(
              POW(SIN(RADIANS((copro.lat_d - p.lat) / 2)), 2)
              + COS(RADIANS(p.lat)) * COS(RADIANS(copro.lat_d))
              * POW(SIN(RADIANS((copro.lon_d - p.lon) / 2)), 2)
            )
          )
        ) AS distance_m
      FROM copro, p
      WHERE copro.lat_d IS NOT NULL AND copro.lon_d IS NOT NULL
      ORDER BY distance_m
      LIMIT 6;
      `,
    )

    return Response.json(rows)
  } catch (err: any) {
    console.error(err)
    return Response.json(
      { error: 'Failed to find copro', details: String(err?.message ?? err) },
      { status: 500 },
    )
  }
}
