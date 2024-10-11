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
                  state: 'prime-black',
                }}
              />.
          </p>
        </>
      )}
      {  (
        <>
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
