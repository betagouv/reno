import { openapi as publicodesOpenapi } from '@publicodes/rest-api'

// Requires superagent and fastify-plugin, probably should be bundled by publicodes/api

export async function GET(request: Request) {
  return Response.json(publicodesOpenapi)
}
