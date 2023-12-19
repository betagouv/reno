'use client'
import { useEffect, useState } from 'react'
import Geste from './Geste'
import TrimestreSelector, { trimestres } from './TrimestreSelector'

export const isValidMontant = (gestePrice) =>
  gestePrice !== 'NA' && gestePrice != 0

export const keyPrice = 'mtttcplanfinsolde',
  keyGeste = 'subtypename',
  keyNumEquipement = 'wpequipement',
  keySurface = 'wpsurface'
export default function Couts({ searchParams }) {
  const [trimestre, setTrimestre] = useState(trimestres.slice(-1)[0])
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!searchParams.key) return
    const doFetch = async () => {
      const url =
        `https://mardata.osc-fr1.scalingo.io/data/` +
        //`http://localhost:3000/data/`
        searchParams.key
      const req = await fetch(url)
      const json = await req.json()

      if (json.error) return setData(json.error)
      setData(json.data)
    }
    doFetch()
  }, [setData, searchParams.key])

  if (!searchParams.key)
    return (
      <p>
        Vous devez entrer la clef dans l'URL (?key=MACLEF) pour accéder aux
        données de coût.
      </p>
    )
  if (data === null)
    return <p>Chargement des données (enfin, si votre clef est la bonne)</p>

  if (typeof data === 'string') return <p>{data}</p>
  console.log(data, typeof data)

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
    const validsRaw = gestes.filter((el) => isValidMontant(el[keyPrice])),
      valids = validsRaw.map((geste) => {
        const total = geste[keyPrice]
        const numEq = geste[keyNumEquipement]
        const surface = geste[keySurface]

        if (numEq !== 'NA' && surface !== 'NA')
          return new Error(
            "Attention, à la fois surface et nombre d'équipement, investiguer",
          )
        if (numEq !== 'NA') return total / numEq
        if (surface !== 'NA') return total / surface

        return total
      })

    const sum = valids.reduce((memo, next) => memo + next, 0),
      mean = sum / valids.length
    const max = Math.max(...valids),
      min = Math.min(...valids)

    const perEquipement = gestes.filter((el) => el[keyNumEquipement] !== 'NA')
    const isPerSingleEquipement = perEquipement.length === gestes.length
    if (perEquipement.length > 0 && perEquipement.length < gestes.length)
      return new Error(
        "Certaines lignes ont un prix par équipement, et d'autres non. Investiguer",
      )
    const perSurface = gestes.filter((el) => el[keySurface] !== 'NA')
    const isPerSurface = perSurface.length === gestes.length
    if (perSurface.length > 0 && perSurface.length < gestes.length)
      return new Error(
        "Certaines lignes ont un prix par équipement, et d'autres non. Investiguer",
      )
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
      isPerSingleEquipement,
      isPerSurface,
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
