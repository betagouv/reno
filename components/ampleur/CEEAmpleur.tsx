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
      engine,
      dottedName,
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      { expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <p>Nous estimons votre prime CEE coup de pouce ampleur à <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant',
                  state: 'final',
                }}
              />.
          </p>
        </>
      )}
      { false && (
        <>
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
        </>
      )}
    </AideAmpleur>
  )
}
