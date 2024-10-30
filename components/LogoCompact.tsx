'use client'

import mesAidesReno from '@/public/logo.svg'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Title } from '@/app/LayoutUI'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'

export default function LogoCompact() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: end;
        padding: 0.5rem;
        border-bottom: 1px solid #dddddd;
      `}
    >
      <a
        target="_blank"
        css={`
          display: flex;
          align-items: center;
          color: black;
          text-decoration: none;
          cursor: pointer;
        `}
        onClick={() => push(['trackEvent', 'Iframe', 'Clic', 'Affiner'])}
        href={`https://mesaidesreno.beta.gouv.fr/simulation?${new URLSearchParams(omit(['display'], searchParams)).toString()}`}
      >
        <Image src={mesAidesReno} height="30" alt="Logo Mes aides Réno" />
        <Title
          css={`
            font-size: 70%;
            line-height: 0.6rem;
            margin: 0 0 0 0.5rem;
            width: 3rem;
          `}
        >
          Mes <strong>Aides Réno</strong>
        </Title>
      </a>
      <a
        href="https://france-renov.gouv.fr"
        target="_blank"
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <Image src={logoFranceRenov} alt="Logo de France Rénov" height="40" />
      </a>
    </div>
  )
}
