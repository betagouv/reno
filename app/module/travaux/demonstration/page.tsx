import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import plusValueImage from '@/public/illuPlusValue.png'
import Demonstration from '../../Demonstration'
import Breadcrumb from '@/components/Breadcrumb'
export const metadata: Metadata = {
  title:
    "Module de calcul d'aide pour les travaux de rénovation d'un logement - Mes aides réno",
  description: `Découvrez la calculette d'aide pour les travaux de rénovation d'un logement proposé par Mes Aides Réno"`,
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
              { Travaux: '/module/travaux/demonstration' },
            ]}
          />
        </Content>
        <HeaderWrapper>
          <Image
            src={plusValueImage}
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
              Calculette des aides pour les{' '}
              <BlueEm>travaux de rénovation</BlueEm> d'un logement
            </h1>
            <Intro>
              <p>
                A partir de votre DPE, visualisez simplement les principaux
                gestes de rénovation envisageables.
              </p>
              <p>
                Grâce à cette calculette, estimez facilement le montant des
                aides spécifiques à chaque geste de rénovation pour votre
                situation.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>

        <Wrapper>
          <Content>
            <Suspense>
              <Demonstration moduleName="travaux" />
            </Suspense>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
