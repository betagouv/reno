'use client'
import useEnrichSituation from '@/components/personas/useEnrichSituation'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { omit } from '@/components/utils'
import Link from 'next/link'
import { useState } from 'react'

export default function PersonaInjection({
  persona,
  keepPersonaBar = false,
  personaIndex,
  enrichedSituation,
}) {
  const [clicked, click] = useState(false)

  if (enrichedSituation)
    return (
      <PersonaLink
        {...{
          enrichedSituation,
          personaIndex,
          keepPersonaBar,
        }}
      />
    )
  if (!clicked) return <button onClick={() => click(true)}>Choisir</button>
  return (
    <Enriched
      {...{ persona, personaIndex, keepPersonaBar, enrichedSituation }}
    />
  )
}

const Enriched = ({ persona, personaIndex, keepPersonaBar }) => {
  const enrichedSituation = useEnrichSituation(persona.situation)
  if (!enrichedSituation) return <span>En cours</span>
  return (
    <PersonaLink
      {...{
        enrichedSituation,
        personaIndex,
        keepPersonaBar,
      }}
    />
  )
}

const PersonaLink = ({ enrichedSituation, personaIndex, keepPersonaBar }) => {
  const setSearchParams = useSetSearchParams()
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
