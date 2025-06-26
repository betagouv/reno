'use client'
import { push } from '@socialgouv/matomo-next'
import { CTA, CTAWrapper } from './UI'
import iconArrow from '@/public/iconArrowCircled.svg'
import Image from 'next/image'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import { useState } from 'react'

export default function BlocConseiller({ situation }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <CTAWrapper $justify="left">
        <CTA
          css={`
            padding: 1rem;
            text-wrap: wrap;
            text-align: center;
            cursor: pointer;
          `}
          $fontSize="normal"
          onClick={() => {
            setIsOpen((prev) => !prev)
            push([
              'trackEvent',
              'Simulateur Principal',
              'Clic',
              'trouver conseiller',
            ])
          }}
        >
          Prendre rdv avec un conseiller
          <Image
            src={iconArrow}
            alt="icone fleche"
            css={`
              margin-left: 0.5rem;
            `}
          />
        </CTA>
      </CTAWrapper>
      {isOpen && (
        <MarSearch situation={situation} what={'trouver-conseiller-renov'} />
      )}
    </>
  )
}
