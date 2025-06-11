import { logoAlt } from '@/components/Header'
import ParFranceRénovTexte from '@/components/ParFranceRénovTexte'
import { InternalLink } from '@/components/UI'
import logo from '@/public/logo-service-de-FR.svg'
import Image from 'next/image'
import styled from 'styled-components'

export default function FooterModule() {
  return (
    <footer
      css={`
        display: flex;
        flex-direction: column;
        align-items: start;
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
        <HeaderLogo src={logo} alt={logoAlt} />
      </InternalLink>
      <AboutContainer>
        <ParFranceRénovTexte />
      </AboutContainer>
    </footer>
  )
}
const HeaderLogo = styled(Image)`
  height: 4.5rem;
  width: auto;
  margin-top: 0.6rem;
  margin-bottom: 0.8rem;
`

export const AboutContainer = styled.p`
  small {
    line-height: 1rem;
    color: gray;
    display: block;
  }
`
