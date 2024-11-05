import useEnrichSituation from '@/components/personas/useEnrichSituation'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import Link from 'next/link'
import React, { useMemo } from 'react'

export default function AmpleurCTA({ userSituation, targetDPE }) {
  const enrichedSituation = useEnrichSituation(userSituation)

  const ctaSituation = useMemo(
    () => ({
      'vous . propriétaire . statut': '"acquéreur"',
      'projet . DPE visé': targetDPE,
      ...(enrichedSituation || userSituation),
    }),
    [targetDPE, userSituation, enrichedSituation],
  )
  return (
    <Link
      href={`/simulation?${new URLSearchParams(encodeSituation(ctaSituation, true)).toString()}`}
    >
      <span>Découvrir toutes les aides&nbsp;&nbsp;➞</span>
    </Link>
  )
}
