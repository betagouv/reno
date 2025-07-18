import { HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import plusValueImage from '@/public/illuPlusValue.png'
import Demonstration from '../../Demonstration'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@codegouvfr/react-dsfr/next-app-router/DsfrProvider'
export const metadata: Metadata = {
  title:
    "Module de calcul de la plus value d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez le module de calcul de la plus value d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
}

export default function Module({}) {
  return (
    <>
      <StartDsfrOnHydration />
      <main>
        <PageBlock>
          <Content>
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
          </Content>
          <HeaderWrapper
            image={
              <Image
                src={plusValueImage}
                alt="Illustration du module plus value"
              />
            }
          >
            <h1>Calculette concernant la plus value d'un logement</h1>
            <Intro>
              <p>
                Mes Aides Réno est un service public de calcul des aides à la
                rénovation energétique. Le sujet est complexe, les aides sont
                multiples, les règles sont mouvantes.
              </p>
              <p>
                En intégrant directement notre calculateur sous forme d'iframe
                chez vous, vous permettez à vos utilisateurs de calculer la
                plus-value sur leur logement sans qu'ils quittent votre site.
              </p>
            </Intro>
          </HeaderWrapper>
          <Wrapper>
            <Content>
              <Suspense>
                <Demonstration moduleName="plus-value" />
              </Suspense>
            </Content>
          </Wrapper>
        </PageBlock>
      </main>
    </>
  )
}
