let { GITHUB_TOKEN } = process.env

export async function GET(request: Request) {
  let baseUrl = 'https://api.github.com/repos/',
    { repo, title, body, labels } = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    )
  const url = baseUrl + repo + '/issues',
    options = {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body,
        labels: (labels && labels.split(',')) || ['Contribution'],
      }),
    }

  try {
    const request = await fetch(url, options)
    const json = await request.json()
    return Response.json({ url: json['html_url'] })
  } catch (error) {
    return console.log(error)
  }
}
