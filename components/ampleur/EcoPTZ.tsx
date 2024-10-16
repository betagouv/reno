import { Key } from '../explications/ExplicationUI'
import MapBehindCTA from '../MapBehindCTA'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Avance, getAmpleurDPEChoice } from '../ScenariosSelector'
import { Card, ExternalLink, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Image from 'next/image'
import { roundToThousands } from '../utils'

export default function EcoPTZ({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'PTZ'
  const choice = getAmpleurDPEChoice(situation)

  const exampleSituation = {
    'projet . travaux': roundToThousands(
      engine.evaluate('projet . enveloppe estimée').nodeValue,
      5,
    ),
    ...situation,
  }
  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {' '}
      {expanded && (
        <p>
          L'éco-PTZ est particulièrement adapté pour{' '}
          <a href="https://www.service-public.fr/particuliers/vosdroits/F36448">
            {' '}
            couvrir le reste à charge des travaux{' '}
          </a>{' '}
          du parcours MaPrimeRénov' accompagné.
        </p>
      )}
      {expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <p>
            L'éco-prêt à taux zéro est accessible à tous, sans condition de
            ressources.
          </p>
          <p>
            Vous pouvez emprunter jusqu'à{' '}
            <Key $state="prime-black">50 000 €</Key> pour une rénovation
            d'ampleur.
          </p>
          <p>La durée du remboursement est de 20 ans maximum.</p>
          <Card
            $background="#f7f8f8"
            css={`
              padding: 1rem;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <p>
                Par rapport à un prêt à la consommation de 50 000 € affecté aux
                travaux à un taux de 5 % sur 20 ans, l'éco-PTZ peut vous faire
                économiser{' '}
                <Key $state="prime-black">
                  <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-de-credit-immobilier/">
                    30 000 € d'intérêts
                  </a>
                </Key>
                .
              </p>
            </div>
          </Card>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`
              list-style-image: url(${checkIcon.src});
              li {
                margin: 1rem 0;
                ul {
                  list-style-image: none;
                }
              }
            `}
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].conditionsEligibilitesHTML,
            }}
          />
        </>
      )}
    </AideAmpleur>
  )
}
