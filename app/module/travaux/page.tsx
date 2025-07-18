import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import plusValueImage from '@/public/illuPlusValue.png'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import codeIcon from '@/public/icon-code.png'
import DPETravauxModule from '@/components/dpe/travaux/DPETravauxModule'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export const metadata: Metadata = {
  title:
    "Module de calcul d'aide pour les travaux de rénovation d'un logement - Mes aides réno",
  description: `Découvrez la calculette d'aide pour les travaux de rénovation d'un logement proposé par Mes Aides Réno"`,
}
export default async function ModuleTravaux({ searchParams }) {
  const numDpe = searchParams.dpe || null
  return (
    <>
      <StartDsfrOnHydration />
      <main>
        <PageBlock>
          <HeaderWrapper
            image={{
              src: plusValueImage,
              alt: 'Illustration du module travaux',
            }}
          >
            <h1>
              Calculette des aides pour les travaux de rénovation d'un logement
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
                  <DPETravauxModule type="module" numDpe={numDpe} />
                  <a
                    className="fr-link"
                    href={`/module/travaux/demonstration`}
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
                  </a>
                </div>
              </Suspense>
            </Content>
          </Wrapper>
        </PageBlock>
      </main>
    </>
  )
}
