import { logoAlt } from '@/components/Header'
import ParFranceRénovTexte from '@/components/ParFranceRénovTexte'
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
        gap: 1rem;

        p {
          margin: 0;
        }
      `}
    >
      <a className="fr-link" href="https://mesaidesreno.beta.gouv.fr">
        <HeaderLogo src={logo} alt={logoAlt} />
      </a>
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
