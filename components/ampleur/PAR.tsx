import calculatorIcon from '@/public/calculator-empty.svg'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, ExternalLink, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import rules from '@/app/règles/rules'
import Image from 'next/image'
// Note : Nous ignorons pour l'instant le PAR "pas plus", qui ne garantit pas un taux zéro, et qui n'est donc pas à propremement parler une aide de l'État.

export default function PAR({ 
  engine,
  situation,
  setSearchParams,
  answeredQuestions, 
  expanded
}) {
  const rule = rules['PAR']
  return (
    <AideAmpleur {...{
      engine,
      dottedName: 'PAR',
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      <p>Vous pouvez obtenir sous certaines conditions un prêt avance mutation avec <strong>un taux zéro pendant 10 ans</strong>.</p>
      { expanded && (
        <>
          <h3>Pour aller plus loin</h3>
          <p>
            Retrouvez plus d'info sur <ExternalLink 
              href="https://www.economie.gouv.fr/particuliers/pret-avance-renovation-energetique-financement-travaux"
              target="_blank"
            >
              ce lien
            </ExternalLink>
          </p>
          {  (
            <>
              <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}></p>
              <InformationBlock>
                <div
                  dangerouslySetInnerHTML={{
                    __html: rules['PAR'].informationsUtilesHtml,
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
            </>
          )}
        </>
      )}
      {/* 
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
      </Card>*/}
    </AideAmpleur>
  )
}
