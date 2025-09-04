'use client'

import { usePathname } from 'next/navigation'
import { Header as DsfrHeader } from '@codegouvfr/react-dsfr/Header'
import useIsInIframe from './useIsInIframe'

export default function Header() {
  const pathname = usePathname()
  const isInIframe = useIsInIframe()

  if (isInIframe === 'rga') return null
  if (pathname.startsWith('/module/') && pathname.endsWith('integration'))
    return null

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
      id="fr-header-with-horizontal-operator-logo"
      operatorLogo={{
        alt: 'Logo Mes Aides Réno',
        imgUrl: '/logo-service-de-FR.svg',
        orientation: 'horizontal',
      }}
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
