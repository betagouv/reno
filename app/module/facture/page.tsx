import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import factureImage from '@/public/illuFacture.png'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import codeIcon from '@/public/icon-code.png'
import DPEFactureModule from '@/components/dpe/DPEFactureModule'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export const metadata: Metadata = {
  title:
    "Module de calcul de la facture d'énergie d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez la calculette de facture d'énergie d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
}
export default async function ModuleFacture({ searchParams }) {
  const numDpe = searchParams.dpe || null
  return (
    <>
      <StartDsfrOnHydration />
      <main>
        <PageBlock>
          <HeaderWrapper
            image={{
              src: factureImage,
              alt: 'Illustration de la calculette facture',
            }}
          >
            <h1>Facture d'énergie d'un logement après rénovation</h1>
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
                  <DPEFactureModule type="module" numDpe={numDpe} />
                  <a
                    className="fr-link"
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
