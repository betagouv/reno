'use client'
import css from '@/components/css/convertToJs'
import { DensityChart } from '@/components/densityGraph/DensityChart'
import gestes from '@/secureData/gestes.csv'

const keyPrice = 'mtttcplanfinsolde',
  keyGeste = 'subtypename'
export default function Couts({}) {
  const aggregation = gestes.reduce((memo, next) => {
    const geste = next[keyGeste]
    const gestes = memo[geste]

    const gestePrice = next[keyPrice]
    const valid = gestePrice !== 'NA' && gestePrice != 0

    return {
      ...memo,
      [geste]: valid ? [...(gestes || []), gestePrice] : gestes,
    }
  }, {})

  const statistics = Object.entries(aggregation)
    .map(([geste, montants]) => {
      if (!montants) return
      const sum = montants.reduce((memo, next) => memo + next, 0),
        mean = sum / montants.length
      return {
        geste,
        sum,
        mean,
        montants,
        num: montants.length,
        median: computeMedian(montants),
      }
    })
    .filter(Boolean)

  console.log(statistics)

  return (
    <div>
      {statistics
        .sort((a, b) => -a.num + b.num)
        .map(({ geste, mean, median, num, montants }) => (
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
                <div>Max : {format(Math.max(...montants))} €</div>
                <div>Min : {format(Math.min(...montants))} €</div>
                <div>Nombre : {num}</div>
              </div>
              <div>
                <DensityChart width={'300'} height={'250'} data={montants} />
                <details>
                  <summary>Voir les montants</summary>
                  <ul>
                    {montants.map((el, i) => (
                      <li key={i}>{el}</li>
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
