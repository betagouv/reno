import { Metadata } from 'next/types'
import aides from '@/app/règles/aides-locales.publicodes'
import { description } from './description'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { PageBlock } from '@/components/UI'
import PlaceSummary from './PlaceSummary'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export const metadata: Metadata = {
  title:
    'Liste des aides locales pour la rénovation energétique - Mes aides réno',
  description,
}

export default function AidesLocales() {
  const byPlace = Object.entries(aides).reduce(
    (memo, next) => {
      const dottedName = next[0]
      if (dottedName === '' || dottedName == '0') return memo

      const place = dottedName.split(' . ')[0]

      return { ...memo, [place]: [...(memo[place] || []), next] }
    },
    [{}],
  )
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Les aides locales à la rénovation en France"
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Les aides',
              linkProps: {
                href: '/aides',
              },
            },
          ]}
        />
        <h1>Les aides locales à la rénovation en France</h1>
        <p>{description}</p>
        <p>
          Sont listées ici les aides financières soutenues par une source
          officielle. Cela peut être une page Web, un PDF sur le site d'une
          collectivité, ou une page ANIL dont la date de vérification est
          récente. Il est de la responsabilité des collectivités de supprimer
          leurs références à des aides obsolètes.
        </p>
        <div className="fr-callout fr-icon-info-line">
          <p>
            Cette liste n'est <em>pas encore validée par les collectivités.</em>{' '}
            Vous disposez d'informations sourcées sur une aide locale ?{' '}
            <a className="fr-link" href="/faq">
              Contactez-nous
            </a>{' '}
            ! En attendant, la{' '}
            <a
              rel="noopener external"
              className="fr-link"
              href="https://www.anil.org/aides-locales-travaux"
            >
              base de l'ANIL
            </a>{' '}
            est la source la plus complète.
          </p>
        </div>
        <ul className="fr-mt-5v">
          {Object.entries(byPlace).map(([place, placeRules]) => (
            <PlaceSummary {...{ place, placeRules }} />
          ))}
        </ul>
      </PageBlock>
    </>
  )
}
