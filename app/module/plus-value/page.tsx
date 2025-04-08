import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { InternalLink, Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationCalculette from '@/public/calculette.png'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import PlusValueModule from '@/components/module/PlusValueModule'
import codeIcon from '@/public/icon-code.png'
export const metadata: Metadata = {
  title:
    "Module de calcul de la plus value d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez le module de calcul de la plus value d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
}

export default function Module({}) {
  return (
    <main
      style={css`
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <HeaderWrapper>
          <Image
            src={illustrationCalculette}
            alt="une personne travaille sur son bureau avec une calculatrice"
          />

          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              <BlueEm>Plus value d'un logement</BlueEm> après rénovation
            </h1>
            <Intro>
              <p>
                Saviez-vous que la performance énergétique de votre logement
                influe fortement sur sa valeur immobilière ?
              </p>
              <p>
                Grâce à cette calculette, estimez facilement l'impact de vos
                travaux de rénovation sur la valeur de votre bien.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper $background="white">
          <Content>
            <Suspense>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <PlusValueModule type={'module'} />
                <InternalLink
                  href={`/module/plus-value/demonstration`}
                  style={css`
                    display: flex;
                    align-items: center;
                    width: fit-content;
                    margin-top: 1rem;
                    gap: 0.5rem;
                  `}
                >
                  <Image
                    src={codeIcon}
                    alt="icone intégration iframe"
                    width="24"
                  />
                  Intégrer ce widget à mon site
                </InternalLink>
              </div>
            </Suspense>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
