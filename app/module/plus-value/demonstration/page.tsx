import { HeaderWrapper } from '@/app/LandingUI'
import { PageBlock } from '@/components/UI'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import plusValueImage from '@/public/illuPlusValue.png'
import Demonstration from '../../Demonstration'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export const metadata: Metadata = {
  title:
    "Module de calcul de la plus value d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez le module de calcul de la plus value d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
}

export default function Module({}) {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Ma plus-value Réno"
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Devenir partenaire',
              linkProps: {
                href: '/devenir-partenaire',
              },
            },
            {
              label: 'Les iframes',
              linkProps: {
                href: '/integration',
              },
            },
          ]}
        />
        <HeaderWrapper
          image={{
            src: plusValueImage,
            alt: 'Illustration du module plus value',
          }}
        >
          <h1>Calculette concernant la plus value d'un logement</h1>
          <p>
            Mes Aides Réno est un service public de calcul des aides à la
            rénovation energétique. Le sujet est complexe, les aides sont
            multiples, les règles sont mouvantes.
          </p>
          <p>
            En intégrant directement notre calculateur sous forme d'iframe chez
            vous, vous permettez à vos utilisateurs de calculer la plus-value
            sur leur logement sans qu'ils quittent votre site.
          </p>
        </HeaderWrapper>
        <Suspense>
          <Demonstration moduleName="plus-value" />
        </Suspense>
      </PageBlock>
    </>
  )
}
