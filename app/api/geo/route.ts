import { NextResponse } from 'next/server'

//
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET(request: Request) {
  const { path } = Object.fromEntries(request.nextUrl.searchParams.entries())
  const newUrl = `https://geo.api.gouv.fr/${decodeURIComponent(path)}`

  console.log('🕵️🕵️', newUrl)

  const response = await fetch(newUrl, {
    headers: {
      ...request.headers,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  return NextResponse.json(data, { headers: corsHeaders })
}
