// Use Deno to run this file
// We're testing Deno because of its stronger standard library and IO packages

import { parse, stringify } from 'jsr:@std/csv'
import { delay } from 'jsr:@std/async/delay'

const rawData = await Deno.readTextFile('./data/exonération-taxe-foncière.csv')

let data = parse(rawData, {
  skipFirstRow: true,
  strip: true,
})

const newCsvLines = await Promise.all(
  data
    //	.slice(0, 10)
    .map(async (line, i) => {
      const codeInsee = line['CODE DEPARTEMENT'] + line['Code Collectivité']

      await delay(100 * i)
      const request = await fetch(
        `https://geo.api.gouv.fr/communes/${codeInsee}?fields=population`,
      )
      const json = await request.json()
      const { population } = json
      return { ...line, population }
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
