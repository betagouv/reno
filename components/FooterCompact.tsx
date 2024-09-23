'use client'

import { CTA } from './UI'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import marianne from '@/public/marianne.svg'
import mesAidesReno from '@/public/logo.svg'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Title } from '@/app/LayoutUI'

export default function FooterCompact() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  return (
    <>
      <section
          css={`
            width: 98vw;
            max-width: 800px;
            margin: -5vh auto;
            display: flex;
            align-items: center;
            background: var(--lightestColor);
            justify-content: space-evenly;
            padding: 1rem;
            p {
              margin: 0 1.5rem;
            }
          `}
        >
        <Image
          src={mesAidesReno}
          width="50"
          alt="Logo Mes aides Réno"
        />
        <Title css={`font-size: 100%;`}>
          Mes <strong>Aides Réno</strong>
        </Title>
        <Image
          src={logoFranceRenov}
          alt="Logo de France Rénov"
          width="80"
          css={`margin-left: 1rem;`}
        />
        <p>
          Découvrez toutes les aides à la rénovation énergétique de votre
          logement
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
    </>
  )
}