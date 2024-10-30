'use client'
import { useEffect, useState } from 'react'
import enrichSituation from './enrichSituation'

export default function useEnrichSituation(situation) {
  const [enrichedSituation, setEnrichedSituation] = useState(null)
  useEffect(() => {
    const asyncEnrich = async () => {
      const newSituation = await enrichSituation(situation)
      setEnrichedSituation(newSituation)
    }
    asyncEnrich()
  }, [situation['logement . commune'], setEnrichedSituation])
  // Pour l'instant, on précise logement . commune pour éviter des appels intempestifs à /api/communes
  // Il faudra améliorer ce système pour enrichir la situation lors de la modification d'autres valeurs de situation 
  
  return enrichedSituation
}
