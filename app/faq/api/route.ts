let { GITHUB_TOKEN } = process.env

export async function GET(request: Request) {
  let baseUrl = 'https://api.github.com/repos/',
    { repo, title, body, labels } = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    )
  const url = baseUrl + repo + '/issues',
    headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    },
    options = {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
        title,
        body,
        labels: (labels && labels.split(',')) || ['Contribution'],
      }),
    }

  console.log(url)
  try {
    const request = await fetch(url, options)
    const json = await request.json()
    console.log(json)
    return Response.json({ url: json['html_url'] })
  } catch (error) {
    return console.log(error)
  }
}
