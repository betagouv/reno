const FromStorageSimulationButton = dynamic(
  () => import('@/components/FromStorageSimulationButton'),
  { ssr: false },
)
import {
  CTA,
  CTAWrapper,
  ExternalLink,
  Intro,
  PageBlock,
} from '@/components/UI'
import css from '@/components/css/convertToJs'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Image from 'next/image'
import Link from 'next/link'
import { HeaderWrapper, Labels, LandingGreenBanner } from './LandingUI'
import dynamic from 'next/dynamic'
import HomepageSteps from './HomepageSteps'
import HomepageTalkAboutUs from './HomepageTalkAboutUs'
import HomepageTestimonies from './HomepageTestimonies'
import NewsBanner from '@/components/NewsBanner'

export const description = `Calculez les aides MaPrimeRénov' 2025 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Mes aides réno 2025',
  description,
  openGraph: { images: ['/jaquette.png'] },
}

export default function Page() {
  return (
    <main
      style={css`
        background: white;

        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <NewsBanner />
      <PageBlock>
        <HeaderWrapper>
          <Image
            src={illustrationAccueil}
            alt="Des ouvriers peignent et réparent la facade d'une maison"
          />
          <div>
            <Labels>
              <li key={'réno'}>⚡️ Rénovation Énergétique</li>
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
            <CTAWrapper $justify="left">
              <CTA $fontSize="normal">
                <Link href="/simulation">➞&nbsp;&nbsp;C'est parti !</Link>
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
            <FromStorageSimulationButton />
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
        <HomepageTestimonies />
        <HomepageTalkAboutUs />
      </PageBlock>
    </main>
  )
}
