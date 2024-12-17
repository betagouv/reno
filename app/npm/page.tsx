import { Main, Section, Card, InternalLink } from '@/components/UI'
import css from '@/components/css/convertToJs'
import Link from '@/node_modules/next/link'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { Metadata } from 'next/types'
import NPM from './NPM'
import NPMExampleProject from './NPMExampleProject'

export const metadata: Metadata = {
  title: 'Paquet NPM - Mes aides réno',
  description: 'Découvrez le paquet NPM de calcul des aides à la rénovation',
}

export default function NPMDoc() {
  return (
    <Main>
      <Section>
        <h2>Paquet NPM Mes Aides Réno</h2>
        <p>
          Notre paquet NPM vous permet d'intégrer Mes Aides Réno au coeur de
          votre service. Si votre objectif est simplement de l'intégrer dans une
          page Web ou un article de blog, nous avons{' '}
          <Link href="/integration">une solution bien plus simple</Link>.
        </p>
        <p
          style={css`
            margin: 0.6rem 0;
            background: lightyellow;
            padding: 0.4rem 1rem;
          `}
        >
          ℹ️ Ce paquet NPM est basée sur le modèle de calcul qui fait tourner
          mesaidesreno.beta.gouv.fr, déjà utilisé par des milliers
          d'utilisateurs par mois.
        </p>
        <Card>
          <div
            style={css`
              display: flex;
              align-items: center;
              margin-bottom: 0.8rem;
              color: #2a82dd;
              font-weight: 500;
            `}
          >
            <Image
              src={informationIcon}
              width="25"
              style={css`
                margin-right: 0.4rem;
              `}
              alt="Icône information"
            />{' '}
            <small>Plus d'informations</small>
          </div>
          <div
            id="accompagnement"
            css={`
              blockquote {
                margin-top: 0.8rem;
                border-left: 4px solid var(--lighterColor);
                padding: 0 0.6rem;
                background: lightyellow;
                color: #333;
              }
            `}
          >
            <p>
              Vous souhaitez utiliser le paquet NPM? Voici notre proposition :
            </p>
            <ul>
              <li
                style={css`
                  margin: 1rem 0;
                `}
              >
                <strong>
                  <u>Accompagnement sur-mesure</u>
                </strong>
                :<br /> L'un des développeurs de l'équipe, Morgan ou Maël, peut
                se rendre disponible pour vous assister en live dans
                l'intégration. D'expérience, 45 minutes suffisent. C'est votre
                souhait ? Merci d’adresser votre demande{' '}
                <a href="mailto:contact@mesaidesreno.fr">ici</a>. Nous prendrons
                contact avec vous sous 3 jours ouvrés.
              </li>
              <li
                style={css`
                  margin: 1rem 0;
                `}
              >
                <strong>
                  <u>Intégration en autonomie</u>
                </strong>
                :<br /> Vous préférez mettre les mains dans la documentation
                existante ? Elle est accessible juste en-dessous.
              </li>
            </ul>
            <p>À votre disposition pour avancer ensemble !</p>
          </div>
        </Card>
      </Section>
      <Section>
        <p>
          Publicodes offre nativement une documentation Web qui vous permet
          d'explorer les calculs de façon granulaire. Pour la découvrir, suivez
          les liens "Inspection" de la{' '}
          <InternalLink href="/personas#tests">
            section "Tests" de la page personas
          </InternalLink>
          .
        </p>
        <h3>Le code</h3>
        <p>
          Tout le code du calculateur (site en NextJS), l'API (Route handler
          NextJS) ainsi que les règles de calcul complètes sont disponibles sur{' '}
          <InternalLink href="https://github.com/betagouv/reno">
            Github
          </InternalLink>
          . Les règles sont aussi accessibles en JSON à{' '}
          <InternalLink href="/api/rules">cette adresse</InternalLink>.
        </p>
        <h3>Privilégiez l'intégration directe du modèle si vous le pouvez</h3>
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
        <h3>Démonstration d'intégration</h3>
        <p>
          Ci-dessous, un exemple très basique d'intégration du modèle de calcul
          dans une maquette de projet NextJS.
        </p>
        <br />
        <NPMExampleProject />
        <br />
        <br />
        <p>
          N'hésitez pas à{' '}
          <InternalLink href="/contact">nous contacter</InternalLink> si vous
          estimez que ce paquet NPM ne répond pas à vos besoins.
        </p>
      </Section>
    </Main>
  )
}
