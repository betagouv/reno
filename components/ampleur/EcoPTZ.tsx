import calculatorIcon from '@/public/calculator-empty.svg'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import Image from 'next/image'

export default function EcoPTZ({ rules }) {
  const dottedName = 'PTZ'
  return (
    <AideAmpleur dottedName={dottedName}>
      <div>
        <p>
          Vous pouvez emprunter jusqu'à 50 000 € sur 20 ans sans devoir
          rembourser d'intérêts pour financer vos travaux de rénovation
          energétique.
        </p>

        <Card $background="#f7f8f8">
          <div
            css={`
              display: flex;
              align-items: center;
              margin-top: 1rem;
            `}
          >
            <Image
              src={calculatorIcon}
              alt="Icône calculette"
              css={`
                width: 3rem !important;
                height: auto !important;
                margin-right: 0.8rem !important;
              `}
            />
            <p>
              Par rapport à un prêt à la consommation de 50 000 € affecté aux
              travaux à un taux de 5 % sur 20 ans,
              <br /> l'éco-PTZ peut vous faire économiser{' '}
              <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-de-credit-immobilier/">
                <PrimeStyle>30 000 € d'intérêts</PrimeStyle>
              </a>
              .
            </p>
          </div>
        </Card>
        <InformationBlock>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].informationsUtilesHtml,
            }}
          />
        </InformationBlock>
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
      </div>
    </AideAmpleur>
  )
}
