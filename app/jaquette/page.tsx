'use client'
import { PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import { HeaderWrapper } from '../LandingUI'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <main>
        <PageBlock>
          <HeaderWrapper
            image={{
              src: illustrationAccueil,
              alt: "Des ouvriers peignent et réparent la facade d'une maison",
            }}
          >
            <h1>Estimez vos aides pour rénover votre logement</h1>
            <p className="fr-tag fr-tag--success-850">
              <span aria-hidden="true">⚡️</span> Rénovation Énergétique
            </p>
            <p>
              Des factures moins élevées dans un logement plus confortable et
              plus écologique.
            </p>
            <p
              style={css`
                margin: 0;
                margin-top: -1rem;
                color: #da504b;
                line-height: 1.3rem;
              `}
            >
              <strong>5 minutes chrono</strong> et sans inscription.
            </p>
          </HeaderWrapper>
        </PageBlock>
      </main>
    </>
  )
}
