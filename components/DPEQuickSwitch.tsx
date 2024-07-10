'use client'
import { useState } from 'react'
import DPELabel from './DPELabel'
import useSetSearchParams from './useSetSearchParams'
import Link from 'next/link'
import Image from 'next/image'
import { encodeSituation } from './publicodes/situationUtils'
import editIcon from '@/public/crayon.svg'

export default function ({ oldIndex, prefixText }) {
  const [editing, setEditing] = useState(false)
  const setSearchParams = useSetSearchParams()
  const text = prefixText === undefined ? 'Vous avez déclaré un ' : prefixText
  return (
    <span>
      {text}
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
            display: inline-flex;
            align-items: center;
            img {
              margin-left: 0.3rem;
              height: 1.2rem;
              width: auto;
            }
          `}
          onClick={() => setEditing(true)}
          title="Cliquez pour choisir un autre DPE actuel de votre logement, dans le cas où vous n'êtes pas certain de votre DPE."
        >
          DPE&nbsp;
          <DPELabel index={oldIndex} />
          <Image src={editIcon} alt="Icône crayon" />
        </span>
      )}
      .
    </span>
  )
}
