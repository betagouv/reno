import { Main, Section, Card, ExternalLink } from '@/components/UI'
import css from '@/components/css/convertToJs'
import Link from '@/node_modules/next/link'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { Metadata } from 'next/types'
import NPM from './NPM'
import ApiExampleProject from './ApiExampleProject'
import ParametersList from './ParametersList'
import EndpointsList from './EndpointsList'

export const metadata: Metadata = {
  title: 'API - Mes aides réno',
  description:
    "Découvrez la documentation de l'API de calcul des aides à la rénovation",
}

export default function APIDoc() {
  return (
    <Main>
      <Section>
        <h2>API Mes Aides Réno</h2>
        <p>
          Notre API vous permet d'intégrer Mes Aides Réno au coeur de votre
          service. Si votre objectif est simplement de l'intégrer dans une page
          Web ou un article de blog, nous avons{' '}
          <Link href="/integration">une solution bien plus simple</Link>.
        </p>
        <p
          style={css`
            margin: 0.6rem 0;
            background: lightyellow;
            padding: 0.4rem 1rem;
          `}
        >
          ℹ️ Cette API est basée sur le modèle de calcul qui fait tourner
          mesaidesreno.beta.gouv.fr, déjà utilisé par des milliers
          d'utilisateurs par mois. L'API est en version beta, il est de votre
          ressort d'en avertir vos utilisateur si cela vous semble légitime.
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
            <p>Vous souhaitez utiliser l'API? Voici notre proposition :</p>
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
        <h3>Que permet l'API ?</h3>
        <p>
          L'API permet, à partir d'une situation d'entrée, d'évaluer
          l'éligibilité ainsi que le montant d'aides auxquels l'utilisateur peut
          prétendre.
        </p>
        <p>
          Plus globalement, elle expose l'intégralité de{' '}
          <ExternalLink
            href="https://github.com/betagouv/reno/tree/master/app/r%C3%A8gles"
            target="_blank"
          >
            notre modèle de calcul
          </ExternalLink>
          , ce qui permet d'accéder via le paramètre <em>"fields"</em> à
          l'ensemble des variables de notre modèle.
          <br />
          <u>Exemple:</u>{' '}
          <ExternalLink
            href="/api/v1/?ménage.revenu.classe='modeste'&fields=ampleur.pourcent%20d%27écrêtement"
            target="_blank"
          >
            /api/v1/?ménage.revenu.classe="modeste"&fields=ampleur.pourcent%20d%27écrêtement
          </ExternalLink>
        </p>
        <h3>Démonstration</h3>
        <p>
          Modifier la <em>situation</em> (les paramètres à gauche), puis cliquer
          sur le bouton
          <em> "Executer"</em> pour voir le résultat.
        </p>
        <EndpointsList />
        <h3 id="parametres">Liste des Paramètres</h3>
        <ParametersList />
        <h3>Spécification</h3>
        <p>
          Notre API est basée sur <a href="https://publi.codes">Publicodes</a>.
          Nous vous conseillons de faire un petit tour (10&nbsp;minutes) sur la
          <a href="https://publi.codes/docs"> documentation</a> de Publicodes
          pour mieux comprendre ses fondamentaux.
        </p>
        <p>
          Pour découvrir l'API, le plus simple est de faire votre simulation sur
          la page d'accueil, ou de cliquer directement sur un persona pour
          charger une des simulations pré-remplies, puis de préfixer l'URL de
          simulation par `/api?PARAMÈTRES`.
        </p>
        <p>
          Publicodes offre nativement une documentation Web qui vous permet
          d'explorer les calculs de façon granulaire. Pour la découvrir, suivez
          les liens "Inspection" de la{' '}
          <a href="/personas#tests">section "Tests" de la page personas</a>.
        </p>
        <h3>Le code</h3>
        <p>
          Tout le code du calculateur (site en NextJS), l'API (Route handler
          NextJS) ainsi que les règles de calcul complètes sont disponibles sur{' '}
          <Link href="https://github.com/betagouv/reno">Github</Link>. Les
          règles sont aussi accessibles en JSON à{' '}
          <Link href="/api/rules">cette adresse</Link>.
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
        <ApiExampleProject />
        <br />
        <br />
        <p>
          N'hésitez pas à{' '}
          <Link href="/api-doc#accompagnement">nous contacter</Link> si vous
          estimez que ce paquet NPM ne répond pas à vos besoins.
        </p>
      </Section>
    </Main>
  )
}
