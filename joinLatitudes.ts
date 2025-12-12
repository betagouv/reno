import { createReadStream, createWriteStream } from 'fs'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'

async function processCSV(inputFilePath: string, outputFilePath: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const parser = parse({
        delimiter: ',',
      })

      const stringifier = stringify()
      const outputStream = createWriteStream(outputFilePath)

      let headers: string[] = []
      let lonIndex = -1
      let latIndex = -1
      let isFirstRow = true
      let rowCount = 0

      // Pipe the output of stringifier to the output file
      stringifier.pipe(outputStream)

      // Handle parser events
      parser.on('readable', () => {
        let record
        while ((record = parser.read()) !== null) {
          if (isFirstRow) {
            // Process headers
            headers = record
            lonIndex = headers.indexOf('long')
            latIndex = headers.indexOf('lat')

            if (lonIndex === -1 || latIndex === -1) {
              throw new Error("CSV file must contain 'long' and 'lat' columns.")
            }

            // Add new header
            const newHeaders = [...headers, 'lat_lon']
            stringifier.write(newHeaders)
            isFirstRow = false
          } else {
            // Process data rows
            const lon = record[lonIndex]
            const lat = record[latIndex]
            const latLon = `POINT(${lat} ${lon})`

            // Add the new column and write to output
            const newRecord = [...record, latLon]
            stringifier.write(newRecord)

            rowCount++
            if (rowCount % 100000 === 0) {
              console.log(`Processed ${rowCount} rows...`)
            }
          }
        }
      })

      parser.on('error', (err) => {
        console.error('Error parsing CSV:', err)
        reject(err)
      })

      parser.on('end', () => {
        stringifier.end()
      })

      outputStream.on('finish', () => {
        console.log(`Processed CSV file has been written to ${outputFilePath}`)
        console.log(`Total rows processed: ${rowCount}`)
        resolve()
      })

      // Create read stream and pipe to parser
      createReadStream(inputFilePath).pipe(parser)
    } catch (error) {
      console.error('Error setting up CSV processing:', error)
      reject(error)
    }
  })
}

const inputFilePath = 'data/rnc-data-gouv-with-qpv.csv'
const outputFilePath = 'data/copro-geo.csv'

processCSV(inputFilePath, outputFilePath).catch(console.error)
