'use client'

import { usePathname } from 'next/navigation'
import { Header as DsfrHeader } from '@codegouvfr/react-dsfr/Header'

export default function Header() {
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
      id="fr-header-with-horizontal-operator-logo"
      operatorLogo={{
        alt: `Logo Mes Aides Réno, représentant une maison bleu blanc rouge ainsi que la marque à laquellee le service est rattaché, le visage souriant France Rénov' avec un toît en guise de couvre-chef.`,
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
