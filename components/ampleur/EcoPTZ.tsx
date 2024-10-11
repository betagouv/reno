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
  expanded
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
    <AideAmpleur {...{
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded
      }}
    >
      { expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <p>L'éco-prêt à taux zéro est accessible à tous, sans condition de ressources.</p>
          <p>Le montant maximum du prêt dépend du nombre de travaux engagés, pour un montant maximal de <Key $state="prime-black">50 000 €</Key>.</p>
          <p>La durée du remboursement est de 20 ans maximum.</p>
          <Card $background="#f7f8f8" css={`padding: 1rem;`}>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <p>
                Par rapport à un prêt à la consommation de 50 000 € affecté aux
                travaux à un taux de 5 % sur 20 ans, l'éco-PTZ peut vous faire économiser{' '}
                <Key $state="prime-black">
                  <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-de-credit-immobilier/">
                    30 000 € d'intérêts
                  </a>
                </Key>.
              </p>
            </div>
          </Card>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0; ul {list-style-image: none;}}`}
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].conditionsEligibilitesHTML,
            }}
          />      
          <InformationBlock>
            <div
              dangerouslySetInnerHTML={{
                __html: rules[dottedName].informationsUtilesHtml,
              }}
            />
          </InformationBlock>
          <p>
            Vous pouvez emprunter jusqu'à 50 000 € sur 20 ans sans devoir
            rembourser d'intérêts pour financer vos travaux de rénovation
            energétique.
          </p>
          <PaymentTypeBlock>
            <p>Le prêt sera à rembourser mensuellement.</p>
          </PaymentTypeBlock>
          <AideCTA text="Demander le prêt à taux zéro">
            <p>
              L'éco-PTZ est disponible auprès de{' '}
              <a href="https://www2.sgfgas.fr/web/site-public/etablissements-affilies">
                ces établissements de crédits
              </a>
              . Découvrir{' '}
              <a href="https://www.service-public.fr/particuliers/vosdroits/F19905">
                la démarche étape par étape
              </a>
              .
            </p>
          </AideCTA> 
        </>
      )}
    </AideAmpleur>
  )
}
