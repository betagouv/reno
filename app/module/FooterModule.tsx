'use client'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

export const FooterModule = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])
  const isMobile = useMediaQuery('(max-width: 400px)')
  return (
    <footer
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: -1rem;
        padding: 0 1rem;
      `}
    >
      <p
        css={`
          margin: 0;
        `}
      >
        <small
          css={`
            line-height: 1rem;
            color: gray;
            display: block;
          `}
        >
          Une initiative construite avec France&nbsp;Rénov{"'"}
          {hydrated && isMobile
            ? '.'
            : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
        </small>
      </p>
      <Image
        src={logoFranceRenov}
        alt="Logo de France Rénov"
        css={
          hydrated &&
          (isMobile
            ? `width: 5rem !important;
                height: auto;
              `
            : `width: 6.5rem !important;
                height: auto;
              `)
        }
      />
    </footer>
  )
}
