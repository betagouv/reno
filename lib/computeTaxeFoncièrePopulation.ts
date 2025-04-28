// Use Deno to run this file
// We're testing Deno because of its stronger standard library and IO packages

import { parse, stringify } from 'jsr:@std/csv'
import { delay } from 'jsr:@std/async/delay'

const rawData = await Deno.readTextFile('./data/exonération-taxe-foncière.csv')

// Here we harcode modifications to the original file when we receive a message telling us the exoneration should not be there
const removeTheseLines = [
  54138, //'COSNES-ET-ROMAIN'
]

let data = parse(rawData, {
  skipFirstRow: true,
  strip: true,
})

const newCsvLines = await Promise.all(
  data
    .map((line) => ({
      ...line,
      code: line['CODE DEPARTEMENT'] + line['Code Collectivité'], // code INSEE qui est construit de cette manière et identifie une commune
    }))
    .filter(({ code }) => !removeTheseLines.includes(code))
    //	.slice(0, 10)
    .map(async (line, i) => {
      await delay(100 * i)
      const request = await fetch(
        `https://geo.api.gouv.fr/communes/${line.code}?fields=population`,
      )
      const json = await request.json()
      const { population } = json
      return {
        ...line,
        population,
        taux: line[
          'FB - Exonération partielle VL log. anciens économes en énergie (art. 1383 OB CGI) - Taux'
        ],
      }
    }),
)

const newCsv = stringify(
  newCsvLines.sort((a, b) => b.population - a.population),
  { columns: Object.keys(newCsvLines[0]) },
)

await Deno.writeTextFile(
  './data/exonération-taxe-foncière-population.csv',
  newCsv,
)

console.log(newCsvLines.reduce((memo, next) => memo + next.population, 0))
