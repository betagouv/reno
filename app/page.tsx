import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Footer from '@/components/Footer'
import { CTA, Intro, PageBlock } from '@/components/UI'
import informationIconBlack from '@/public/information-black.svg'
import Image from 'next/image'
import { HeaderWrapper, LandingGreenBanner } from './LandingUI'

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
              Calculez vos aides rénovation
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
            <CTA href="/simulation/introduction">Commencer la simulation</CTA>
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
            <h2>Pourquoi un simulateur Mes aides Réno ?</h2>
            <p>
              Rénover son logement permet de réduire ses factures et d’améliorer
              son confort, en luttant contre le froid et le chaud. C’est
              également l’un des leviers importants de notre transition
              énergétique et climatique. Le gouvernement et les collectivités
              territoriales accompagnent les propriétaires dans leur projets à
              travers plusieurs dispositif d’aides.
            </p>
            <p>
              Ces d’aides peuvent vous accompagner dans une rénovation d’ampleur
              de votre logement ou la réalisation d’un ou plusieurs gestes de
              travaux (changement des fenêtre, installation d’une pompe à
              chaleur, isolation des murs…).
            </p>
            <p>
              Mes Aides Réno vous permet :
              <ul>
                <li>
                  d’évaluer rapidement votre éligibilité aux principaux
                  dispositifs
                </li>
                <li>de choisir celui qui est le plus pertinent pour vous</li>
                <li>
                  et d’estimer le montant de vos aides en fonction de votre
                  situation personnel et de votre projet de rénovation
                </li>
              </ul>
            </p>

            <h2>Qui est éligible aux dispositifs ?</h2>
            <p>
              Les aides a la rénovation sont accessibles à tous les
              propriétaires, qu’ils habitent leur logement ou le mettent en
              location, ainsi qu’aux copropriétaires. Elles sont ouvertes aux
              maisons individuelles, aux appartements et aux copropriétés. Il
              faut cependant que le logement soit une résidence principale.
            </p>
            <p>
              Si vous êtes locataire, vous n’êtes pas éligible aux aides.
              Cependant, le simulateur Mes aides réno peut vous aider à mieux
              informer et à sensibiliser votre bailleur.
            </p>
            <h2>Quels sont les dispositifs ?</h2>
            <p>
              Mes aides réno vous donnera votre éligibilité et les montants de
              Ma Prime Rénov', aussi bien le parcours accompagné que le parcours
              par geste. Dans un second temps, seront aussi inclus l'éco-prêt à
              taux zéro, et les aides locales.
            </p>
          </Content>
        </Wrapper>
        <Footer />
      </PageBlock>
    </main>
  )
}
