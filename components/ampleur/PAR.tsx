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
      <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}></p>
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
