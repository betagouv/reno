import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import factureImage from '@/public/illuFacture.png'
import Demonstration from '../../Demonstration'
import Breadcrumb from '@/components/Breadcrumb'
export const metadata: Metadata = {
  title:
    "Module de calcul de la facture énergétique d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez le module de calcul de la facture énergétique d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
}

export default function Module({}) {
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <Content>
          <Breadcrumb
            links={[
              { 'Devenir partenaire': '/devenir-partenaire' },
              { 'Les iframes': '/integration' },
              { "Facture d'énergie": '/module/facture/demonstration' },
            ]}
          />
        </Content>
        <HeaderWrapper>
          <Image
            src={factureImage}
            alt="Illustration de la calculette Facture d'énergie"
            style={css`
              margin: 1rem;
            `}
          />
          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              Calculette pour l'évolution de la{' '}
              <BlueEm>facture d'énergie</BlueEm> d'un logement
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
          </div>
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
  )
}
