import FromStorageSimulationButtonLoader from '@/components/FromStorageSimulationButtonLoader'
import { PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Image from 'next/image'
import Link from 'next/link'
import HomepageModules from './HomepageModules'
import HomepageSteps from './HomepageSteps'
import HomepageTalkAboutUs from './HomepageTalkAboutUs'
import HomepageTestimonies from './HomepageTestimonies'
import { HeaderWrapper } from './LandingUI'

import ParFranceRénovTexte from '@/components/ParFranceRénovTexte'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const description = `Calculez les aides MaPrimeRénov' 2025 pour la rénovation de votre logement. Découvrez aussi les prêts à taux zéro, les gestes de rénovation, les exonérations fiscales telles que Denormandie.`

export const metadata: Metadata = {
  title:
    'Mes aides réno : simulateur officiel des aides à la rénovation energétique 2025',
  description,
  openGraph: { images: ['/jaquette.png'] },
}

export default async function Page(props) {
  const searchParams = await props.searchParams

  return (
    <>
      <StartDsfrOnHydration />
      <main role="main" id="content">
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
              Une rénovation énergétique pour des factures moins élevées dans un
              logement plus confortable et plus écologique.
            </p>
            <p
              style={css`
                margin: 0 0 1em 0;
                color: #555;
                line-height: 1.3rem;
              `}
            >
              <strong
                style={css`
                  color: #da504b;
                `}
              >
                5 minutes chrono
              </strong>{' '}
              et sans inscription.
            </p>
            <div
              style={css`
                display: flex;
                flex-direction: column;
                gap: 1em;
              `}
            >
              <Link
                className="fr-btn fr-icon-arrow-right-line fr-btn--icon-left"
                href={{
                  pathname: '/simulation',
                  query: searchParams, // needed to pass "iframe" and "sendDataToHost" params to the simulation
                }}
                prefetch={false}
              >
                C'est parti !
              </Link>
              <Link href="/copropriete" className="fr-btn fr-btn--secondary">
                Je représente une copropriété
              </Link>
              <FromStorageSimulationButtonLoader />
            </div>
          </HeaderWrapper>
          <div className="fr-grid-row fr-my-5v fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle">
            <div className="fr-col-auto">
              <Image src={logoFranceRenov} alt="Logo de France Rénov" />
            </div>
            <div className="fr-col-6">
              <ParFranceRénovTexte />
            </div>
          </div>
          <HomepageSteps />
          <HomepageModules />
          <HomepageTestimonies />
          <HomepageTalkAboutUs />
        </PageBlock>
      </main>
    </>
  )
}
