import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import factureImage from '@/public/illuFacture.png'
import Demonstration from '../../Demonstration'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export const metadata: Metadata = {
  title:
    "Module de calcul de la facture énergétique d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez le module de calcul de la facture énergétique d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
}

export default function Module({}) {
  return (
    <>
      <StartDsfrOnHydration />
      <main>
        <PageBlock>
          <Content>
            <Breadcrumb
              currentPageLabel="Facture d'énergie"
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
          </Content>
          <HeaderWrapper
            image={{
              src: factureImage,
              alt: "Illustration de la calculette Facture d'énergie",
            }}
          >
            <h1>
              Calculette pour l'évolution de la facture d'énergie d'un logement
            </h1>
            <Intro>
              <p>
                Outre un gain de confort indéniable, avez-vous pensé aux
                économies réalisées sur la facture d'énergie de votre logement
                après rénovation ?
              </p>
              <p>
                Grâce à cette calculette, estimez facilement l'impact de vos
                travaux de rénovation sur la facture d'énergie de votre bien.
              </p>
            </Intro>
          </HeaderWrapper>
          <Wrapper>
            <Content>
              <Suspense>
                <Demonstration moduleName="facture" />
              </Suspense>
            </Content>
          </Wrapper>
        </PageBlock>
      </main>
    </>
  )
}
