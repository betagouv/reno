import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import Demonstration from '../../Demonstration'
export const metadata: Metadata = {
  title:
    "Module de calcul de la plus value d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez le module de calcul de la plus value d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
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
        <HeaderWrapper>
          <Image
            src={illustrationAccueil}
            alt="Des ouvriers peignent et réparent la facade d'une maison"
          />

          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              <BlueEm>Module de calcul</BlueEm> de la plus value d'un logement
            </h1>
            <Intro>
              <p>
                Mes Aides Réno est un service public de calcul des aides à la
                rénovation energétique. Le sujet est complexe, les aides sont
                multiples, les règles sont mouvantes.
              </p>
              <p>
                En intégrant directement notre calculateur sous forme d'iframe
                chez vous, vous permettez à vos utilisateurs de calculer leurs
                aides sans qu'ils quittent votre site.
              </p>
            </Intro>
          </div>
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
  )
}
