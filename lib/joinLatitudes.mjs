import { createReadStream, createWriteStream } from 'node:fs'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'
import fs from 'node:fs/promises'

function processCSV(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    try {
      const parser = parse({ delimiter: ',' })
      const stringifier = stringify()
      const outputStream = createWriteStream(outputFilePath)

      let headers = []
      let lonIndex = -1
      let latIndex = -1
      let isFirstRow = true
      let rowCount = 0

      stringifier.pipe(outputStream)

      parser.on('readable', () => {
        let record
        while ((record = parser.read()) !== null) {
          if (isFirstRow) {
            headers = record
            lonIndex = headers.indexOf('long')
            latIndex = headers.indexOf('lat')

            stringifier.write([...headers, 'lat_lon'])
            isFirstRow = false
          } else {
            const lon = record[lonIndex]
            const lat = record[latIndex]

            const latLon = `POINT(${lon} ${lat})`

            stringifier.write([...record, latLon])

            rowCount++
          }
        }
      })

      parser.on('error', (err) => reject(err))
      parser.on('end', () => stringifier.end())

      outputStream.on('finish', () => {
        resolve()
      })

      createReadStream(inputFilePath).pipe(parser)
    } catch (error) {
      reject(error)
    }
  })
}
const input = 'data/rnc-data-gouv-with-qpv.csv'
const output = 'data/copro-geo.csv'

try {
  await processCSV(input, output)
  await fs.unlink(input)
} catch (e) {
  console.error(e)
}