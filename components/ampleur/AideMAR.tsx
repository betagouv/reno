import PaymentTypeBlock from '../PaymentTypeBlock'
import { CTA, CTAWrapper, Card, ExternalLink } from '../UI'
import Value from '../Value'
import AideAmpleur, { AideCTA } from './AideAmpleur'
import checkIcon from '@/public/check.svg'

export default function AideMAR({
  engine,
  situation,
  dottedName,
  setSearchParams,
  answeredQuestions,
  rules,
  expanded,
}) {
  const rule = rules[dottedName]
  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        level: 2,
        expanded,
      }}
    >
      {expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <Card $background="#f7f8f8">
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <AideMontant
                {...{
                  engine,
                  situation,
                  dottedName,
                }}
              />
            </div>
          </Card>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`
              list-style-image: url(${checkIcon.src});
              li {
                margin: 1rem 0;
                ul {
                  list-style-image: none;
                }
              }
            `}
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].conditionsEligibilitesHTML,
            }}
          />
        </>
      )}
    </AideAmpleur>
  )
}

export function AideMontant({ engine, situation, dottedName }) {
  return (
    <p>
      En tant que ménage{' '}
      <Value
        {...{
          engine,
          situation,
          dottedName: 'ménage . revenu . classe',
          state: 'prime-black',
        }}
      />
      , vous bénéficiez d'une aide de{' '}
      <Value
        {...{
          engine,
          situation,
          dottedName: dottedName + ' . montant',
          state: 'prime-black',
        }}
      />{' '}
      pour l'accompagnement MaPrimeRénov'.
    </p>
  )
}
