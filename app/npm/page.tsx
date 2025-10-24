import { PageBlock } from '@/components/UI'
import Link from '@/node_modules/next/link'
import { Metadata } from 'next/types'
import NPM from './NPM'
import NPMExampleProject from './NPMExampleProject'
import { ContactIntegration } from '@/components/Integration'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export const metadata: Metadata = {
  title: 'Paquet NPM - Mes aides réno',
  description: 'Découvrez le paquet NPM de calcul des aides à la rénovation',
}

export default function NPMDoc() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Paquet NPM Mes Aides Réno"
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Devenir partenaire',
              linkProps: {
                href: '/devenir-partenaire',
              },
            },
          ]}
        />
        <h1>Paquet NPM Mes Aides Réno</h1>
        <p>
          Notre paquet NPM vous permet d'intégrer Mes Aides Réno au coeur de
          votre service. Si votre objectif est simplement de l'intégrer dans une
          page Web ou un article de blog, nous avons{' '}
          <Link className="fr-link" href="/integration">
            une solution bien plus simple
          </Link>
          .
        </p>
        <div className="fr-callout fr-icon-info-line">
          <h2 className="fr-callout__title">Plus d'informations</h2>
          <p className="fr-callout__text">
            Ce paquet NPM est basée sur le modèle de calcul qui fait tourner
            mesaidesreno.beta.gouv.fr, déjà utilisé par des milliers
            d'utilisateurs par mois.
          </p>
          <p className="fr-callout__text">
            Vous souhaitez utiliser le paquet NPM? Voici notre proposition :
          </p>
          <ul className="fr-callout__text">
            <li>
              <strong>
                <u>Accompagnement sur-mesure</u>
              </strong>
              :<br /> L'un des développeurs de l'équipe, Morgan ou Maël, peut se
              rendre disponible pour vous assister en live dans l'intégration.
              D'expérience, 45 minutes suffisent. C'est votre souhait ? Merci
              d’adresser votre demande{' '}
              <a href="mailto:contact@mesaidesreno.fr">ici</a>. Nous prendrons
              contact avec vous sous 3 jours ouvrés.
            </li>
            <li>
              <strong>
                <u>Intégration en autonomie</u>
              </strong>
              :<br /> Vous préférez mettre les mains dans la documentation
              existante ? Elle est accessible juste en-dessous.
            </li>
          </ul>
          <p className="fr-callout__text">
            À votre disposition pour avancer ensemble !
          </p>
        </div>
        <p>
          Publicodes offre nativement une documentation Web qui vous permet
          d'explorer les calculs de façon granulaire. Pour la découvrir, suivez
          les liens "Inspection" de la{' '}
          <a className="fr-link" href="/personas#tests">
            section "Tests" de la page personas
          </a>
          .
        </p>
        <h2>Le code</h2>
        <p>
          Tout le code du calculateur (site en NextJS), l'API (Route handler
          NextJS) ainsi que les règles de calcul complètes sont disponibles sur{' '}
          <a
            className="fr-link"
            rel="noopener external"
            href="https://github.com/betagouv/reno"
          >
            Github
          </a>
          . Les règles sont aussi accessibles en JSON à{' '}
          <a className="fr-link" href="/api/rules">
            cette adresse
          </a>
          .
        </p>
        <h2>Privilégiez l'intégration directe du modèle si vous le pouvez</h2>
        <p>
          Plutôt que de dépendre d'une API tierce, si vous avez confiance dans
          votre capacité à mettre des services en ligne, le mieux reste
          d'intégrer le moteur de calcul publicodes chez vous. C'est ce qui rend
          la démonstration plus haut si fluide, les calculs sont faits{' '}
          <em>dans votre navigateur, sans appel réseau</em>. Si vous êtes dans
          un environnement Javascript, il suffit de quelques lignes de code.
          Sinon, un simple projet Javascript avec ExpressJs permet de faire
          tourner une API en 30 minutes sur vos serveurs.
        </p>
        <p>
          Pour ce faire, nous vous proposons un paquet NPM. NPM est le standard
          de facto de la publication de module de code Javascript.{' '}
        </p>
        <NPM />
        <h2 className="fr-mt-5v">Démonstration d'intégration</h2>
        <p>
          Ci-dessous, un exemple très basique d'intégration du modèle de calcul
          dans une maquette de projet NextJS.
        </p>
        <NPMExampleProject />
        <ContactIntegration type="npm" />
      </PageBlock>
    </>
  )
}
