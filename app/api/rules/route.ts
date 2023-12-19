import rules from '@/app/rules'

export async function GET(request: Request) {
  return Response.json(rules)
}
