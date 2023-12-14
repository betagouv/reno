'use client'
import css from '@/components/css/convertToJs'
import { DensityChart } from '@/components/densityGraph/DensityChart'
import gestes1 from '@/secureData/mpr_geste_paiementsolde_2023T1.csv'
import gestes2 from '@/secureData/mpr_geste_paiementsolde_2023T2.csv'
import gestes3 from '@/secureData/mpr_geste_paiementsolde_2023T3.csv'
import { useState } from 'react'
import FilterableChart from './FilterableChart'
import Geste from './Geste'
import TrimestreSelector, { trimestres } from './TrimestreSelector'

const data = [
  ...gestes1.map((el) => ({ ...el, trimestre: 1 })),
  ...gestes2.map((el) => ({ ...el, trimestre: 2 })),
  ...gestes3.map((el) => ({ ...el, trimestre: 3 })),
]

export const isValidMontant = (gestePrice) =>
  gestePrice !== 'NA' && gestePrice != 0

export const keyPrice = 'mtttcplanfinsolde',
  keyGeste = 'subtypename'
export default function Couts({}) {
  const [trimestre, setTrimestre] = useState(trimestres.slice(-1)[0])
  const filteredData = data.filter((el) => el.trimestre === trimestre)

  const groupedByGeste = filteredData.reduce((memo, next) => {
    const geste = next[keyGeste]
    const gestes = memo[geste]

    return {
      ...memo,
      [geste]: [...(gestes || []), next],
    }
  }, {})

  console.log({ groupedByGeste })

  const statistics = Object.entries(groupedByGeste).map(([geste, gestes]) => {
    const montants = gestes.map((geste) => geste[keyPrice])
    const valids = montants.filter(isValidMontant)
    const sum = valids.reduce((memo, next) => memo + next, 0),
      mean = sum / valids.length
    const max = Math.max(...valids),
      min = Math.min(...valids)
    console.log('gestes', gestes)
    return {
      valids,
      geste,
      sum,
      mean,
      num: gestes.length,
      numValids: valids.length,
      median: computeMedian(valids),
      min,
      elements: gestes,
      max,
    }
  })

  return (
    <div>
      <TrimestreSelector {...{ setTrimestre, trimestre }} />
      <ol>
        {statistics
          .sort((a, b) => -a.num + b.num)
          .map((geste) => (
            <Geste {...geste} key={geste[keyGeste]} />
          ))}
      </ol>
    </div>
  )
}

function computeMedian(numbers) {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}
