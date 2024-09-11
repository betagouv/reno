'use client'
import { useEffect, useState } from 'react'
import enrichSituation from './enrichSituation'

export default function useEnrichSituation(situation) {
  const [enrichedSituation, setEnrichedSituation] = useState(null)
  useEffect(() => {
    const asyncEnrich = async () => {
      const éligibilité = await enrichSituation(situation)
      setEnrichedSituation({
        ...situation,
        'logement . commune . denormandie': éligibilité.denormandie
          ? 'oui'
          : 'non',
      })
    }
    asyncEnrich()
  }, [situation, setEnrichedSituation])

  return enrichedSituation
}
