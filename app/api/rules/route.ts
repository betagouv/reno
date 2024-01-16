import rules from '@/app/règles/rules'

export async function GET(request: Request) {
  return Response.json(rules)
}
