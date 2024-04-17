'use client'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
export default function PersonInjection({ persona }) {
  const setSearchParams = useSetSearchParams()
  return (
    <Link
      href={setSearchParams(
        encodeSituation(
          persona.situation,
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
