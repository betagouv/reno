import { PageBlock } from '@/components/UI'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import { Metadata } from 'next/types'
import { HeaderWrapper } from '@/app/LandingUI'
import communes from '@/data/exonération-taxe-foncière-population.csv'
import { sortBy } from '@/components/utils'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Badge from '@codegouvfr/react-dsfr/Badge'

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
      <PageBlock>
        <HeaderWrapper
          image={{
            src: illustrationAccueil,
            alt: "Des ouvriers peignent et réparent la facade d'une maison",
          }}
        >
          <h1>Communes éligibles à l'exonération de la taxe foncière</h1>
          <p>
            Les collectivités locales peuvent proposer une exonération de la
            taxe foncière sur les propriétés bâties (TFPB) pour certains
            logements rénovés.
          </p>
          <p>
            Il n'existe pas encore de liste officielle complète des communes qui
            proposent cette exonération. Découvrez ici une sélection à titre
            indicatif.
          </p>
        </HeaderWrapper>

        <p>
          C'est la commune du logement qui ouvre droit à l'exonération de taxe
          foncière, pas la commune de résidence du propriétaire du logement.
        </p>
        <p>
          Voici une sélection des communes qui sembleraient offrir cette
          exonération :
        </p>
        <ul>
          {sortBy((c) => c.commune)(communes).map(
            ({ 'Nom de la collectivité': commune, code, taux, population }) => {
              return (
                <li key={commune} className="fr-mb-3v">
                  <h3>{commune}</h3>
                  <div>Code commune : {code || <em>à renseigner</em>}</div>
                  <div>
                    Taux d'exonération :{' '}
                    <Badge severity="success" noIcon>
                      {taux} %
                    </Badge>
                  </div>
                  <div>{formatter.format(population)} habitants</div>
                </li>
              )
            },
          )}
        </ul>
        <h2>Comment vérifier l'éligibilité de votre commune ?</h2>
        <p>
          Vous devez <strong>contacter les services de communes</strong> pour
          vous assurer de votre éligibilité à cette exonération.
        </p>
        <h2>Toujours à jour</h2>
        <p>
          En intégrant dès maintenant le calculateur sur votre site, vous
          profiterez automatiquement des mises à jour qui auront lieu très
          prochainement pendant l'été et à la rentrée 2024 et ajouteront
          progressivement toutes les aides à la rénovation energétique.
        </p>
      </PageBlock>
    </>
  )
}

const formatter = new Intl.NumberFormat('fr-FR', {})
