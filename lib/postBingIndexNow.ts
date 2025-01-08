import * as https from 'https'
const createOptions = (data) => ({
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length,
  },
})

const createBody = (urlList) =>
  JSON.stringify({
    host: 'mesaidesreno.beta.gouv.fr',
    key: '6b014308ba1b40c0ba3daeef87048090',
    keyLocation:
      'https://mesaidesreno.beta.gouv.fr/6b014308ba1b40c0ba3daeef87048090.txt',
    urlList,
  })

export default async function postBingIndexNow(urlList) {
  const data = createBody(urlList)
  const options = createOptions(data)

  let p = new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''

      res.on('data', (chunk) => {
        responseBody += chunk
      })

      res.on('end', () => {
        resolve(JSON.parse(responseBody))
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.write(data)
    req.end()
  })

  return await p
}
