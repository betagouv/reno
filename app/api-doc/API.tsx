'use client'
import { ContactIntegration } from '@/components/Integration'
import {
  AccordionTitle,
  Card,
  ExternalLink,
  Main,
  MiseEnAvant,
  Section,
} from '@/components/UI'
import { useState } from 'react'
import ParametersList from './ParametersList'
import EndpointsList from './EndpointsList'
import Link from '@/node_modules/next/link'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'

export default function API() {
  const [displayParams, setDisplayParams] = useState(false)
  return (
    <>
      <Main>
        <Section
          css={`
            margin-bottom: 3vh;
          `}
        >
          <h2>API Mes Aides Réno</h2>
          <p>
            Notre API vous permet d'intégrer Mes Aides Réno au coeur de votre
            service. Si votre objectif est simplement de l'intégrer dans une
            page Web ou un article de blog, nous avons{' '}
            <Link href="/integration">une solution bien plus simple</Link>.
          </p>
          <Card>
            <div
              css={`
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
                css={`
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
          </Card>
          <MiseEnAvant $type="warning" $noradius={true}>
            <h4
              css={`
                margin: 0 0 1rem;
              `}
            >
              Demandez votre token!
            </h4>
            <p>
              Notre API est entièrement gratuite, libre d'accès et sans aucun
              quota d'utilisation. Nous vous demandons simplement de nous{' '}
              <a href="mailto:contact@mesaidesreno.fr?subject=Demande de token API">
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
          </MiseEnAvant>
          <h3>Que permet l'API ?</h3>
          <p>
            L'API permet, à partir d'une situation d'entrée, d'évaluer
            l'éligibilité ainsi que le montant d'aides auxquels l'utilisateur
            peut prétendre.
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
            Modifier la <em>situation</em> (les paramètres à gauche), puis
            cliquer sur le bouton
            <em> "Executer"</em> pour voir le résultat.
          </p>
          <EndpointsList />
          <AccordionTitle
            aria-expanded={displayParams}
            aria-controls={`accordion-params`}
            onClick={() => setDisplayParams(!displayParams)}
            css={`
              margin-top: 2rem;
              border-bottom: 1px solid #ddd;
              color: black;
            `}
          >
            <h3
              id="parametres"
              css={`
                margin: 0;
              `}
            >
              Liste des Paramètres
            </h3>
          </AccordionTitle>
          {displayParams && (
            <div
              id={`accordion-params`}
              css={`
                margin-bottom: 2rem;
                padding: 1rem;
                border: 1px solid #ddd;
              `}
            >
              <p>
                Notre API est basée sur{' '}
                <ExternalLink href="https://publi.codes">
                  Publicodes
                </ExternalLink>
                . Nous vous conseillons de faire un petit tour (10&nbsp;minutes)
                sur la
                <ExternalLink href="https://publi.codes/docs">
                  {' '}
                  documentation
                </ExternalLink>{' '}
                de Publicodes pour mieux comprendre ses fondamentaux.
              </p>
              <p>
                Vous pouvez aussi consulter notre{' '}
                <ExternalLink href="https://github.com/betagouv/reno/tree/master/app/r%C3%A8gles">
                  modèle de calcul{' '}
                </ExternalLink>
                qui recense l'entièreté des paramètres disponibles ainsi que
                davantage de documentation.
              </p>
              <ParametersList />
            </div>
          )}
        </Section>
      </Main>
      <ContactIntegration type="api" />
    </>
  )
}
