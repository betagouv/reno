import { Intro, PageBlock, PrimeStyle } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import communes from '@/data/exonération-taxe-foncière-population.csv'
import { sortBy } from '@/components/utils'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

const title =
  "Communes éligibles à l'exonération de taxe foncière pour rénovation"

const description =
  "Découvrez une sélection de communes éligibles à l'exonération de taxe foncière pour rénovation energétique"
export const metadata: Metadata = {
  title,
  description,
}

export default function Module({}) {
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
            <h1>Communes éligibles à l'exonération de la taxe foncière</h1>
            <Intro>
              <p>
                Les collectivités locales peuvent proposer une exonération de la
                taxe foncière sur les propriétés bâties (TFPB) pour certains
                logements rénovés.
              </p>
              <p>
                Il n'existe pas encore de liste officielle complète des communes
                qui proposent cette exonération. Découvrez ici une sélection à
                titre indicatif.
              </p>
            </Intro>
          </HeaderWrapper>

          <Wrapper>
            <Content>
              <p>
                C'est la commune du logement qui ouvre droit à l'exonération de
                taxe foncière, pas la commune de résidence du propriétaire du
                logement.
              </p>
              <p>
                Voici une sélection des communes qui sembleraient offrir cette
                exonération :
              </p>
              <ul>
                {sortBy((c) => c.commune)(communes).map(
                  ({
                    'Nom de la collectivité': commune,
                    code,
                    taux,
                    population,
                  }) => {
                    return (
                      <li
                        key={commune}
                        style={css`
                          margin: 1rem 0;
                        `}
                      >
                        <h3
                          style={css`
                            font-size: 125%;
                            margin: 0;
                          `}
                        >
                          {commune}
                        </h3>
                        <div>
                          Code commune : {code || <em>à renseigner</em>}
                        </div>
                        <div>
                          Taux d'exonération
                          <span>
                            {' : '}
                            <PrimeStyle>{taux} %</PrimeStyle>
                          </span>
                        </div>
                        <div>{formatter.format(population)} habitants</div>
                      </li>
                    )
                  },
                )}
              </ul>
              <br />
            </Content>
          </Wrapper>
          <Wrapper $background="white" $noMargin={true} $last={true}>
            <Content>
              <h2>Comment vérifier l'éligibilité de votre commune ?</h2>
              <p>
                Vous devez
                <BlueEm>
                  <strong>contacter les services de communes</strong>
                </BlueEm>{' '}
                pour vous assurer de votre éligibilité à cette exonération.
              </p>
            </Content>
          </Wrapper>
          <Wrapper $background="white" $noMargin={true} $last={true}>
            <Content>
              <h2>Toujours à jour</h2>
              <p>
                En intégrant dès maintenant le calculateur sur votre site, vous
                profiterez automatiquement des mises à jour qui auront lieu très
                prochainement pendant l'été et à la rentrée 2024 et ajouteront
                progressivement toutes les aides à la rénovation energétique.
              </p>
            </Content>
          </Wrapper>
        </PageBlock>
      </main>
    </>
  )
}

const formatter = new Intl.NumberFormat('fr-FR', {})
