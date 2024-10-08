import calculatorIcon from '@/public/calculator-empty.svg'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import Image from 'next/image'
import Value from '../Value'

export default function CEEAmpleur({ 
  rules, 
  engine, 
  situation, 
  setSearchParams, 
  answeredQuestions, 
  expanded 
}) {
  const dottedName = "CEE . rénovation d'ampleur"

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
            />{' '}
            <p>
              Nous estimons votre prime CEE coup de pouce ampleur à{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant',
                  state: 'final',
                }}
              />
              .
            </p>
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
        <AideCTA text="Demander la prime CEE ampleur">
          <p>
            Les entreprises peuvent vous solliciter pour vous proposer de
            bénéficier des CEE. Vous pouvez également vous renseigner vous-même
            auprès d’un ou plusieurs fournisseurs d’énergie et comparer les
            montants de CEE proposés.
          </p>
          <p>
            Prenez conseil auprès d’un espace conseil France Rénov’ pour
            vérifier si l’offre que l’on vous propose correspond à votre besoin.
            Ensuite, reprenez contact avec le fournisseur d’énergie choisi ou
            l’installateur partenaire. Ils doivent impérativement s’engager à
            vous apporter une incitation à réaliser des écono- mies d’énergie
            avant la signature du devis.
          </p>
          <p>
            Consultez{' '}
            <a href="https://www.ecologie.gouv.fr/politiques-publiques/coup-pouce-renovation-dampleur-maisons-appartements-individuels">
              la fiche officielle
            </a>{' '}
            du Ministère de l'Écologie pour plus d'informations.
          </p>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
