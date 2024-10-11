import calculatorIcon from '@/public/calculator-empty.svg'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, ExternalLink, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import rules from '@/app/règles/rules'
import Image from 'next/image'
import checkIcon from '@/public/check.svg'
// Note : Nous ignorons pour l'instant le PAR "pas plus", qui ne garantit pas un taux zéro, et qui n'est donc pas à propremement parler une aide de l'État.

export default function PAR({ 
  engine,
  situation,
  setSearchParams,
  answeredQuestions, 
  expanded
}) {
  const dottedName = 'PAR'
  const rule = rules[dottedName]
  return (
    <AideAmpleur {...{
      engine,
      dottedName: 'PAR',
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      { expanded && (
        <>
          <p>{rule.paiement}</p>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0; ul {list-style-image: none;}}`}
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].conditionsEligibilitesHTML,
            }}
          />
        </>
      )}
    </AideAmpleur>
  )
}
