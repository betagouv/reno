import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Footer from '@/components/Footer'
import { CTA, CTAWrapper, Intro, PageBlock } from '@/components/UI'
import informationIconBlack from '@/public/information-black.svg'
import Link from 'next/link'
import Image from 'next/image'
import { HeaderWrapper, LandingGreenBanner } from './LandingUI'
import VisualExplanation from './VisualExplanation'

export const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
}

export default function Page({ searchParams }) {
  return (
    <main>
      <PageBlock>
        <HeaderWrapper>
          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
              `}
            >
              Calculez vos aides à la rénovation énergétique
            </h1>
            <Intro>
              <p>
                En 2024, les aides évoluent pour mieux accompagner les
                rénovations énergétiques.
              </p>

              <p>
                Estimez vos droits en ⌚️ 5 minutes en fonction de votre
                situation et de votre projet.
              </p>
            </Intro>
            <CTAWrapper $justify="left">
              <CTA>
                <Link href="/simulation">
                  ➞&nbsp;&nbsp;Commencer la simulation
                </Link>
              </CTA>
            </CTAWrapper>
            <p
              style={css`
                margin: 0;
                margin-top: -1rem;
                font-style: italic;
                color: #555;
                line-height: 1.3rem;
              `}
            >
              Pour l'instant limité à la France&nbsp;hexagonale.
            </p>
          </div>
          <Image
            src="/brouillons/illustration.svg"
            width="200"
            height="200"
            alt="Une maison dessinée avec la couleur orange d'un mauvais DPE, avec des murs isolés en vert"
          />
        </HeaderWrapper>
        <LandingGreenBanner>
          <Image
            src={informationIconBlack}
            width="25"
            style={css`
              margin-right: 1rem;
            `}
          />
          <p>
            Une initiative du gouvernement et de l'Agence nationale de l'habitat
            pour simplifier l’accès à l’information sur les aides à la
            rénovation énergétique.{' '}
          </p>
        </LandingGreenBanner>
        <Wrapper $background="white" $noMargin={true}>
          <Content>
            <h2>Qu'est-ce que c'est ?</h2>
            <h3>1) Je réponds à un questionnaire détaillé</h3>
            <p>
              6 questions pour évaluer votre éligibilité et estimer le montant
              le vos aides.
            </p>
            <h3>2) Je découvre les aides auxquelles je suis éligible</h3>
            <p>
              Et j’affine mon projet pour obtenir un montant d’enveloppe global
              pour mes travaux.
            </p>
            <h3>3) J’exporte le résultat de ma simulation</h3>
            <p>
              Pour le partager avec mon conseiller local France Rénov’, mes
              proches ou mes artisans.
            </p>
          </Content>
        </Wrapper>
        <Wrapper $noMargin={true}>
          <Content>
            <h2>
              Vous aider à vous projeter la rénovation énergétique de votre
              logement
            </h2>
            <p>
              Rénover son logement permet de réduire ses factures et d’améliorer
              son confort d’hiver et d’été. C’est également l’un des leviers
              importants de notre transition énergétique et climatique.
            </p>
            <p>
              De nombreuses aides existent à l’échelle nationale ou local. En
              tant que particulier, il est parfois difficile à s’y retrouver.
              Mes Aides Réno vous accompagne dans le choix du bon dispositif en
              fonction de votre situation.
            </p>
            <p>
              Les aides a la rénovation sont accessibles à tous les
              propriétaires, qu’ils habitent leur logement ou le mettent en
              location, ainsi qu’aux copropriétaires. Elles permettent de
              financer une rénovation d’ampleur, comme la réalisation d’un ou
              plusieurs gestes de travaux (changement des fenêtre, installation
              d’une pompe à chaleur, isolation des murs…).
            </p>

            <p>
              Si vous êtes locataire, vous n’êtes pas éligible aux aides.
              Cependant, le simulateur Mes aides réno peut vous aider à mieux
              informer et à sensibiliser votre bailleur.
            </p>
          </Content>
        </Wrapper>

        <Wrapper $background="white" $noMargin={true}>
          <Content>
            <h2>Quels sont les dispositifs ?</h2>
            <p>
              En 2024, les aides à la rénovation énergétique des logements sont
              organisées autour de deux grands dispositifs nationaux, Ma Prime
              Rénov' <strong>accompagnée</strong>, et Ma Prime Rénov'{' '}
              <strong>par gestes</strong>.
            </p>

            <p>
              Ces deux aides peuvent être cumulées avec des aides locales et
              d’autres dispositifs (Éco-prêt à taux zéro, Crédit d’impôt…).
            </p>
            <p>
              <strong>
                Ce simulateur vous aide à les comprendre et à choisir le
                dispositif qui vous convient le mieux.
              </strong>
            </p>
            <VisualExplanation />
            <CTAWrapper $justify="center">
              <CTA>
                <Link href="/simulation">Commencer la simulation</Link>
              </CTA>
            </CTAWrapper>
          </Content>
        </Wrapper>
        <Footer />
      </PageBlock>
    </main>
  )
}
