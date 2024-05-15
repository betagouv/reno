'use client'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { omit } from '@/components/utils'
import Link from 'next/link'
export default function PersonInjection({ persona }) {
  const setSearchParams = useSetSearchParams()
  return (
    <Link
      href={setSearchParams(
        encodeSituation(
          // To trigger the MPR Scenario screen, we omit one of the dependencies that make it pop
          omit(['projet . travaux'], persona.situation),
          false,
          Object.keys(persona.situation),
        ),
        'url',
        true,
        `simulation`,
      )}
    >
      Injecter
    </Link>
  )
}
