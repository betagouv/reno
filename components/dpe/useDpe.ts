'use client'
import { isValidDpeNumber } from '@/app/api/dpe/route'
import { useEffect, useState } from 'react'

export const fetchDPE = async (dpe) => {
  if (!isValidDpeNumber(dpe)) return
  try {
    const request = await fetch(
      `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?q=numero_dpe%3D${dpe}`,
    )
    const json = await request.json()
    return json.results[0]
  } catch (e) {
    console.error(e)
  }
}

export default function useDpe(numDpe) {
  const [dpe, setDpe] = useState()

  useEffect(() => {
    async function fetchData() {
      const result = await fetchDPE(numDpe)
      setDpe(result)
    }
    if (numDpe) {
      fetchData()
    }
  }, [numDpe])

  return dpe
}
