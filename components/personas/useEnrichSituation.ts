'use client'
import { useEffect, useState } from 'react'
import enrichSituation from './enrichSituation'

export default function useEnrichSituation(situation) {
  const [enrichedSituation, setEnrichedSituation] = useState(null)
  useEffect(() => {
    const asyncEnrich = async () => {
      const newSituation = await enrichSituation(situation)
      console.log('red', newSituation)
      setEnrichedSituation(newSituation)
    }
    asyncEnrich()
  }, [situation, setEnrichedSituation])

  return enrichedSituation
}
