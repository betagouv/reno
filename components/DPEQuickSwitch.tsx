import { useState } from 'react'
import DPELabel from './DPELabel'
import useSetSearchParams from './useSetSearchParams'
import Link from 'next/link'
import { encodeSituation } from './publicodes/situationUtils'

export default function ({ oldIndex }) {
  const [editing, setEditing] = useState(false)
  const setSearchParams = useSetSearchParams()
  return (
    <p>
      Vous partez d'un{' '}
      {editing ? (
        <span
          css={`
            a {
              margin: 0 0.1rem;
            }
          `}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Link
              onClick={() => setEditing(false)}
              href={setSearchParams(
                encodeSituation({ 'DPE . actuel': index + 1 + '*' }),
                'url',
              )}
            >
              <DPELabel index={index} />
            </Link>
          ))}
        </span>
      ) : (
        <span
          css={`
            text-decoration: underline dotted var(--color);
            cursor: pointer;
          `}
          onClick={() => setEditing(true)}
          title="Cliquez pour choisir un autre DPE actuel de votre logement, dans le cas où vous n'êtes pas certain de votre DPE."
        >
          DPE <DPELabel index={oldIndex} />
        </span>
      )}
      .
    </p>
  )
}
