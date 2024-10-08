import rules from '@/app/règles/rules'
import calculatorIcon from '@/public/calculator-empty.svg'
import Image from 'next/image'
import Link from 'next/link'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { CTA, CTAWrapper, Card } from '../UI'
import Value from '../Value'
import AideAmpleur, { AideCTA } from './AideAmpleur'

export default function AideMAR({
  engine,
  situation,
  exampleSituation,
  dottedName,
  searchParams,
  setSearchParams,
  answeredQuestions,
  rules,
  expanded
}) {
  
  const rule = rules[dottedName]
  return (
    <AideAmpleur {...{
      dottedName, 
      setSearchParams,
      situation,
      answeredQuestions,
      level: 2,
      expanded
    }}>
        <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />

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
              En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'final',
                }}
              />
              , vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName,
                  state: 'final',
                }}
              />{' '}
              pour l'accompagnement MaPrimeRénov'.
            </p>
          </div>
        </Card>
        <PaymentTypeBlock>
          <p>
            Nous ne savons pas s'il sagit d'une avance ou d'un remboursement
            après paiement de l'Accompagnateur Rénov'.
          </p>
        </PaymentTypeBlock>
        <AideCTA text="Trouver mon Accompagnateur">
          <p>
            Vous pourrez notamment consulter l'annuaire des Accompagnateurs
            Rénov'.
          </p>
          <CTAWrapper $justify="left">
            <CTA>
              <a href="https://france-renov.gouv.fr/preparer-projet/faire-accompagner/mon-accompagnateur-renov">
                Documentation France-Rénov
              </a>
            </CTA>
          </CTAWrapper>
        </AideCTA>
    </AideAmpleur>
  )
}
