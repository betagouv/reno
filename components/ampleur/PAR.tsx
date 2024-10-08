import calculatorIcon from '@/public/calculator-empty.svg'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import Image from 'next/image'
// Note : Nous ignorons pour l'instant le PAR "pas plus", qui ne garantit pas un taux zéro, et qui n'est donc pas à propremement parler une aide de l'État.

export default function PAR({ 
  rules,
  situation,
  setSearchParams,
  answeredQuestions, 
  expanded
}) {
  const dottedName = 'PAR'

  const rule = rules[dottedName]

  return (
    <AideAmpleur {...{
      dottedName,
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      <div>
        <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}></p>

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
            <p>{rule.montant}</p>
          </div>
        </Card>
        <InformationBlock>
          <div
            dangerouslySetInnerHTML={{
              __html: rule.informationsUtilesHtml,
            }}
          />
        </InformationBlock>
        <PaymentTypeBlock>
          <p>{rule.paiement}</p>
        </PaymentTypeBlock>
        <AideCTA text="Demander le PAR 0 %">
          <p>
            Assurez-vous d'abord que vos travaux de rénovation{' '}
            <a href="https://www.service-public.fr/particuliers/vosdroits/F38425">
              sont couverts
            </a>{' '}
            par ce dispositif. Dans le cas d'un dossier MaPrimeRénov'
            accompagnée, ce sera probablement le cas.
          </p>
          <p>
            Le PAR est disponible auprès de{' '}
            <a href="https://www2.sgfgas.fr/web/site-public/etablissements-affilies">
              ces établissements de crédits
            </a>
            , colonne "Prêts avance mutation".{' '}
          </p>
          <p>
            Découvrir{' '}
            <a href="https://www.service-public.fr/particuliers/vosdroits/F38425">
              la démarche étape par étape
            </a>
            .
          </p>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
