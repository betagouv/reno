let { GITHUB_TOKEN, RETOURS_SECRET } = process.env

export async function GET(request: Request) {
  let baseUrl = 'https://api.github.com/repos/',
    { repo, title, body, labels, secret } = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    )

  if (secret != RETOURS_SECRET) Response.json({ error: 'Erreur' })

  const url = baseUrl + repo + '/issues',
    options = {
      method: 'GET',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
    }

  console.log('URL', url)

  try {
    const request = await fetch(url, options)
    const json = await request.json()
    return Response.json(json)
  } catch (error) {
    return console.log(error)
  }
}
