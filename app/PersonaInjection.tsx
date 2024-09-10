'use client'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { omit } from '@/components/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PersonaInjection({
  persona,
  keepPersonaBar = false,
  personaIndex,
}) {
  const setSearchParams = useSetSearchParams()
  const [clicked, click] = useState(false)
  const [enrichedSituation, enrichSituation] = useState(null)

  useEffect(() => {
    if (!clicked) return
    const asyncEnrich = async () => {
      const url = `/api/communes?insee=${persona.situation['logement . commune']}`
      const request = await fetch(url)
      const éligibilité = await request.json()
      enrichSituation({
        ...persona.situation,
        'logement . commune . denormandie': éligibilité.denormandie
          ? 'oui'
          : 'non',
      })
    }
    asyncEnrich()
  }, [persona.situation, enrichSituation, clicked])

  if (!clicked) return <button onClick={() => click(true)}>Choisir</button>
  if (!enrichedSituation) return <span>En cours</span>
  return (
    <Link
      href={setSearchParams(
        {
          ...encodeSituation(
            // To trigger the MPR Scenario screen, we omit one of the dependencies that make it pop
            omit(['projet . travaux'], enrichedSituation),
            false,
            Object.keys(enrichedSituation),
          ),
          persona: personaIndex,
          personas: keepPersonaBar,
        },
        'url',
        true,
        `simulation`,
      )}
    >
      Injecter
    </Link>
  )
}
