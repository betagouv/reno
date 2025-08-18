'use client'

import useIsInIframe from '@/components/useIsInIframe'
import logo from '@/public/logo-service-de-FR.svg'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import { Header as DsfrHeader } from '@codegouvfr/react-dsfr/Header'

export default function Header() {
  const isInIframe = useIsInIframe()
  const isMobile = useMediaQuery('(max-width: 800px)', {
    initializeWithValue: false,
    defaultValue: true,
  })

  const pathname = usePathname()
  if (pathname.startsWith('/module/') && pathname.endsWith('integration'))
    return

  return (
    <DsfrHeader
      brandTop={
        <>
          RÉPUBLIQUE
          <br />
          FRANCAISE
        </>
      }
      homeLinkProps={{
        href: '/',
        title: 'Accueil - Mes Aides Réno',
      }}
      id="fr-header-simple-header-with-service-title-and-tagline"
      serviceTitle={
        <HeaderLogo
          src={logo}
          alt="Logo Mes Aides Réno, représentant une maison bleu blanc rouge ainsi que la marque à laquellee le service est rattaché, le visage souriant France Rénov' avec un toît en guise de couvre-chef."
        />
      }
      quickAccessItems={[
        {
          text: 'Blog',
          linkProps: {
            href: '/blog',
          },
        },
        {
          text: 'Les aides',
          linkProps: {
            href: '/aides',
          },
        },
        {
          text: 'Contact',
          linkProps: {
            href: '/contact',
          },
        },
        {
          text: 'Devenir partenaire',
          linkProps: {
            href: '/devenir-partenaire',
          },
        },
      ]}
    />
  )
}

const HeaderLogo = styled(Image)`
  height: 4rem;
  width: auto;
`
