'use client'
import { CTA } from '@/components/UI'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import styled from 'styled-components'

export default function Banner({}) {
  return (
    <Section>
      <div>
        <header>
          <Image src={informationIcon} alt="infobulle" width="25" />
          <strong>
            23 juin 2025 : le guichet MaPrimeRénov’ parcours accompagné est
            temporairement suspendu
          </strong>
        </header>
        <div>
          <p>
            La réouverture de MaPrimeRénov’ dédiée à la rénovation globale
            individuelle est prévue vers le 15 septembre 2025.  Les autres aides
            restent disponibles (travaux par geste, copropriétés). Le simulateur
            sera bientôt mis à jour.
          </p>
        </div>
      </div>
    </Section>
  )
}

const Section = styled.section`
  padding: 1rem 1.2rem;

  width: 100vw;
  background: #e8edff;
  color: #0063cb;
  img {
    vertical-align: text-bottom;
    margin-right: 0.4rem;
    display: block;
  }
  header {
    display: flex;
    margin-bottom: 0.6rem;
  }
  strong {
    display: block;
  }
  > div {
    width: 900px;
    max-width: 100%;
    margin: 0 auto;
  }
`
