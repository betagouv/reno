const RETOURS_REPO = process.env.RETOURS_REPO

const getIssues = async (secret) => {
  const request = await fetch(
    '/retours/api?repo=' + RETOURS_REPO + '?secret=' + secret,
  )
  const json = await request.json()
  return json
}

export default async function Retours({ searchParams }) {
  const { secret } = await searchParams
  if (!secret) return <section>404</section>
  const issues = await getIssues(secret)
  console.log(issues)
  return (
    <section>
      <ol>{issues.map((issue) => issue.body)}</ol>
    </section>
  )
}
