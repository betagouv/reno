'use client'
import css from '@/components/css/convertToJs'
import { DensityChart } from '@/components/densityGraph/DensityChart'
import gestes1 from '@/secureData/mpr_geste_paiementsolde_2023T1.csv'
import gestes2 from '@/secureData/mpr_geste_paiementsolde_2023T2.csv'
import gestes3 from '@/secureData/mpr_geste_paiementsolde_2023T3.csv'
import FilterableChart from './FilterableChart'

const gestes = [
  ...gestes1.map((el) => ({ ...el, trimestre: 1 })),
  ...gestes2.map((el) => ({ ...el, trimestre: 2 })),
  ...gestes3.map((el) => ({ ...el, trimestre: 3 })),
]

const isValidMontant = (gestePrice) => gestePrice !== 'NA' && gestePrice != 0

export const keyPrice = 'mtttcplanfinsolde',
  keyGeste = 'subtypename'
export default function Couts({}) {
  const groupedByGeste = gestes.reduce((memo, next) => {
    const geste = next[keyGeste]
    const gestes = memo[geste]

    return {
      ...memo,
      [geste]: [...(gestes || []), next],
    }
  }, {})

  console.log({ groupedByGeste })

  const statistics = Object.entries(groupedByGeste)
    .map(([geste, gestes]) => {
      const montants = gestes.map((geste) => geste[keyPrice])
      const valids = montants.filter(isValidMontant)
      const sum = valids.reduce((memo, next) => memo + next, 0),
        mean = sum / valids.length
      const max = Math.max(...valids),
        min = Math.min(...valids)
      return {
        valids,
        geste,
        sum,
        mean,
        num: gestes.length,
        numValids: valids.length,
        median: computeMedian(valids),
        min,
        max,
      }
    })
    .filter(Boolean)

  console.log(statistics)

  return (
    <div>
      {statistics
        .sort((a, b) => -a.num + b.num)
        .map(({ geste, mean, median, num, numValids, min, max, valids }) => (
          <li key={geste}>
            <h3>{geste}</h3>
            <div
              style={css`
                display: flex;
                align-items: center;
              `}
            >
              <div>
                <div>Médiane : {format(median)} €</div>
                <div>Moyenne : {format(mean)} €</div>
                <div>Max : {format(max)} €</div>
                <div>Min : {format(min)} €</div>
                <div>
                  Nombre : {num} dont {numValids}{' '}
                  <details>
                    <summary
                      style={css`
                        display: inline;
                      `}
                    >
                      valides
                    </summary>
                    valides (différents de 0 ou de NA)
                  </details>
                </div>
              </div>
              <div>
                <FilterableChart
                  data={gestes.filter((el) => isValidMontant(el[keyPrice]))}
                />
                <details>
                  <summary>Voir les entrées</summary>
                  <ul>
                    {gestes.map((el, i) => (
                      <li key={i}>{el[keyPrice]}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          </li>
        ))}
    </div>
  )
}

const format = (val) =>
  Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val)

function computeMedian(numbers) {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}
