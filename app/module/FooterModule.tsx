import styled from 'styled-components'
import ParFranceRénovTexte from '@/components/ParFranceRénovTexte'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import { Title } from '../LayoutUI'
import { InternalLink } from '@/components/UI'

export default function FooterModule() {
  return (
    <footer
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: -1rem;

        p {
          margin: 0;
          margin-left: 1rem;
        }
      `}
    >
      <InternalLink
        href="https://mesaidesreno.beta.gouv.fr"
        css={`
          text-decoration: none;
          color: inherit;
          &:hover {
            background: 0;
          }
          > div {
            @media (max-width: 400px) {
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            font-size: 90%;
          `}
        >
          <Image
            src={logo}
            alt="Logo de Mes Aides Réno"
            css={`
              width: 2.6rem !important;
            `}
          />
          <Title>
            Mes <strong>Aides Réno</strong>
          </Title>
        </div>
      </InternalLink>
      <Image
        src={logoFranceRenov}
        alt="Logo de France Rénov"
        css={`
          width: 6.5rem !important;
          margin-right: 1rem;
          @media (max-width: 400px) {
            width: 5rem !important;
            margin: 0;
          }
        `}
      />
      <AboutContainer>
        <ParFranceRénovTexte />
      </AboutContainer>
    </footer>
  )
}

export const AboutContainer = styled.p`
  small {
    line-height: 1rem;
    color: gray;
    display: block;
  }
`
