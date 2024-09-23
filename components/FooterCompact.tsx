'use client'

import { CTA } from './UI'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import mesAidesReno from '@/public/logo.svg'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Title } from '@/app/LayoutUI'

export default function FooterCompact() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  return (
    <section
        css={`
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          background: var(--lightestColor);
          justify-content: center;
          padding: 0.5rem 0;
          p {
            margin: 1rem;
            font-size: 100%;
            line-height: 1.3rem;
          }
        `}
      >
      <div css={`display: flex;align-items: center;`}>
        <Image
          src={mesAidesReno}
          width="50"
          alt="Logo Mes aides Réno"
        />
        <Title css={`font-size: 100%;line-height: 1rem;`}>
          Mes <strong>Aides Réno</strong>
        </Title>
        <Image
          src={logoFranceRenov}
          alt="Logo de France Rénov"
          width="80"
        />
      </div>
      <p>
        Découvrez les aides à la rénovation<br /> énergétique pour votre logement
      </p>
      <CTA
        css={`
          margin-bottom: 0;
          a  {
            display: flex;
            font-size: 85% !important;
            align-items: center;
            img {
              height: 2rem;
              width: auto;
              margin-right: 0.6rem;
            }
          }
        `}
      >
        <a
          target="_blank"
          href={`https://mesaidesreno.beta.gouv.fr/simulation?${new URLSearchParams(searchParams).toString()}`}
        >
          <span>➞&nbsp;&nbsp;J'affine ma simulation</span>
        </a>
      </CTA>
    </section>
  )
}