import FromStorageSimulationButtonLoader from '@/components/FromStorageSimulationButtonLoader'
import {
  CTA,
  CTAWrapper,
  ExternalLink,
  Intro,
  PageBlock,
} from '@/components/UI'
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
import { HeaderWrapper, Labels, LandingGreenBanner } from './LandingUI'

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
            <Labels>
              <li key={'réno'}>
                <span aria-hidden="true">⚡️</span> Rénovation Énergétique
              </li>
            </Labels>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              Estimez vos aides pour rénover votre logement
            </h1>
            <Intro>
              <p>
                Une rénovation énergétique pour des factures moins élevées dans
                un logement plus confortable et plus écologique.
              </p>
            </Intro>
            <p
              style={css`
                margin: 0;
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
                padding-top: 1rem;
              `}
            >
              <CTAWrapper $justify="left">
                <CTA $fontSize="normal">
                  <Link
                    href={{
                      pathname: '/simulation',
                      query: searchParams, // needed to pass "iframe" and "sendDataToHost" params to the simulation
                    }}
                    prefetch={false}
                  >
                    ➞&nbsp;&nbsp;C'est parti !
                  </Link>
                </CTA>
              </CTAWrapper>
              <CTAWrapper $justify="left">
                <CTA
                  $fontSize="normal"
                  $importance="secondary"
                  style={css`
                    padding: 0.5rem 0;
                  `}
                >
                  <Link href="/copropriete">Je représente une copropriété</Link>
                </CTA>
              </CTAWrapper>
              <FromStorageSimulationButtonLoader />
            </div>
          </div>
        </HeaderWrapper>
        <LandingGreenBanner>
          <div>
            <Image src={logoFranceRenov} alt="Logo de France Rénov" />
            <p>
              Une initiative construite avec{' '}
              <ExternalLink href="https://france-renov.gouv.fr" target="_blank">
                France&nbsp;Rénov'
              </ExternalLink>{' '}
              pour simplifier l’information sur les
              aides&nbsp;à&nbsp;la&nbsp;rénovation&nbsp;énergétique.{' '}
              <Link
                href="/a-propos"
                style={css`
                  white-space: nowrap;
                `}
              >
                En savoir plus.
              </Link>
            </p>
          </div>
        </LandingGreenBanner>
        <HomepageSteps />
        <HomepageModules />
        <HomepageTestimonies />
        <HomepageTalkAboutUs />
      </PageBlock>
    </main>
  )
}
