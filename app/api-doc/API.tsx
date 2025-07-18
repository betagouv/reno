'use client'
import { ContactIntegration } from '@/components/Integration'
import { Main, Section } from '@/components/UI'
import ParametersList from './ParametersList'
import EndpointsList from './EndpointsList'
import Link from '@/node_modules/next/link'

export default function API() {
  return (
    <>
      <Main>
        <Section>
          <h1>API Mes Aides Réno</h1>
          <p>
            Notre API vous permet d'intégrer Mes Aides Réno au coeur de votre
            service. Si votre objectif est simplement de l'intégrer dans une
            page Web ou un article de blog, nous avons{' '}
            <Link className="fr-link" href="/integration">
              une solution bien plus simple
            </Link>
            .
          </p>
          <div className="fr-callout fr-icon-info-line">
            <h2>Plus d'informations</h2>
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
                  css={`
                    margin: 1rem 0;
                  `}
                >
                  <strong>
                    <u>Accompagnement sur-mesure</u>
                  </strong>
                  :<br /> L'un des développeurs de l'équipe, Morgan ou Maël,
                  peut se rendre disponible pour vous assister en live dans
                  l'intégration. D'expérience, 45 minutes suffisent. C'est votre
                  souhait ? Merci d’adresser votre demande{' '}
                  <a href="mailto:contact@mesaidesreno.fr">ici</a>. Nous
                  prendrons contact avec vous sous 3 jours ouvrés.
                </li>
                <li
                  css={`
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
          </div>
          <div className="fr-callout fr-callout--yellow-moutarde">
            <h3>Demandez votre token!</h3>
            <p>
              Notre API est entièrement gratuite, libre d'accès et sans aucun
              quota d'utilisation. Nous vous demandons simplement de nous{' '}
              <a
                className="fr-link"
                href="mailto:contact@mesaidesreno.fr?subject=Demande de token API"
              >
                informer de son utilisation
              </a>
              .
            </p>
            <p>
              Cela nous permettra de vous transmettre un token d'identification
              et de vous avertir en amont en cas de modifications majeures liées
              à d'éventuelles évolutions légales concernant les dispositifs
              d'aides à la rénovation.
            </p>
          </div>
          <h2>Que permet l'API ?</h2>
          <p>
            L'API permet, à partir d'une situation d'entrée, d'évaluer
            l'éligibilité ainsi que le montant d'aides auxquels l'utilisateur
            peut prétendre.
          </p>
          <p>
            Plus globalement, elle expose l'intégralité de{' '}
            <a
              rel="noopener external"
              className="fr-link"
              href="https://github.com/betagouv/reno/tree/master/app/r%C3%A8gles"
              target="_blank"
            >
              notre modèle de calcul
            </a>
            , ce qui permet d'accéder via le paramètre <em>"fields"</em> à
            l'ensemble des variables de notre modèle.
            <br />
            Exemple :{' '}
            <a
              className="fr-link"
              href="/api/v1/?ménage.revenu.classe='modeste'&fields=ampleur.pourcent%20d%27écrêtement"
              target="_blank"
            >
              /api/v1/?ménage.revenu.classe="modeste"&fields=ampleur.pourcent%20d%27écrêtement
            </a>
          </p>
          <h2>Démonstration</h2>
          <p>
            Modifier la <em>situation</em> (les paramètres à gauche), puis
            cliquer sur le bouton
            <em> "Executer"</em> pour voir le résultat.
          </p>
          <EndpointsList />
          <h3 className="fr-my-5v" id="parametres">
            Liste des Paramètres
          </h3>
          <p>
            Notre API est basée sur{' '}
            <a
              rel="noopener external"
              className="fr-link"
              href="https://publi.codes"
            >
              Publicodes
            </a>
            . Nous vous conseillons de faire un petit tour (10&nbsp;minutes) sur
            la
            <a
              rel="noopener external"
              className="fr-link"
              href="https://publi.codes/docs"
            >
              {' '}
              documentation
            </a>{' '}
            de Publicodes pour mieux comprendre ses fondamentaux.
          </p>
          <p>
            Vous pouvez aussi consulter notre{' '}
            <a
              rel="noopener external"
              className="fr-link"
              href="https://github.com/betagouv/reno/tree/master/app/r%C3%A8gles"
            >
              modèle de calcul
            </a>
            qui recense l'entièreté des paramètres disponibles ainsi que
            davantage de documentation.
          </p>
          <ParametersList />
        </Section>
      </Main>
      <ContactIntegration type="api" />
    </>
  )
}
