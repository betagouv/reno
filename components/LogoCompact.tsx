'use client'

import mesAidesReno from '@/public/logo.svg'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Title } from '@/app/LayoutUI'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'

export default function LogoCompact() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  return (
    <div css={`position: absolute; right: 10px;display: flex;`}>
      <a
        target="_blank"
        css={`
          display: flex;
          align-items: center;
          color: black;
          text-decoration: none;
          cursor: pointer;
        `}
        onClick={() => push(["trackEvent", "Iframe", "Clic", "Affiner"]) }
        href={`https://mesaidesreno.beta.gouv.fr/simulation?${new URLSearchParams(omit(['display'], searchParams)).toString()}`}
      >
        <Image
          src={mesAidesReno}
          width="40"
          alt="Logo Mes aides Réno"
        />
        <Title css={`
          font-size: 90%;
          line-height: 0.8rem;
          margin: 0 0 0 0.5rem;
          width: 3rem;
        `}>
          Mes <strong>Aides Réno</strong>
        </Title>
      </a>
    </div>
  )
}