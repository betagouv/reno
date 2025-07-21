import { HeaderWrapper } from '@/app/LandingUI'
import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import plusValueImage from '@/public/illuPlusValue.png'
import Demonstration from '../../Demonstration'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export const metadata: Metadata = {
  title:
    "Module de calcul d'aide pour les travaux de rénovation d'un logement - Mes Aides Réno",
  description: `Découvrez la calculette d'aide pour les travaux de rénovation d'un logement proposé par Mes Aides Réno"`,
}
export default function Module({}) {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Travaux"
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
            alt: 'Illustration de la calculette Travaux',
          }}
        >
          <h1>
            Calculette des aides pour les travaux de rénovation d'un logement
          </h1>
          <p>
            A partir de votre DPE, visualisez simplement les principaux gestes
            de rénovation envisageables.
          </p>
          <p>
            Grâce à cette calculette, estimez facilement le montant des aides
            spécifiques à chaque geste de rénovation pour votre situation.
          </p>
        </HeaderWrapper>
        <Suspense>
          <Demonstration moduleName="travaux" />
        </Suspense>
      </PageBlock>
    </>
  )
}
