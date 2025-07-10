import DPEScenario from '@/components/mpra/DPEScenario'
import AideAmpleur from './AideAmpleur'
import { Card, CTA } from '../UI'
import rules from '@/app/règles/rules'
import Value from '../Value'
import { Écrêtement } from '@/components/explications/Écrêtement'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'
import { roundToThousands } from '../utils'
export default function MPRA({
  isEligible,
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  expanded,
}) {
  const dottedName = 'MPR . accompagnée'
  const isMobile = window.innerWidth <= 600

  // Si le montant des travaux n'est pas précisé, on l'estime
  if (!situation['projet . travaux']) {
    situation['projet . travaux'] = roundToThousands(
      engine.evaluate('projet . enveloppe estimée').nodeValue
        ? engine.evaluate('projet . enveloppe estimée').nodeValue
        : 0,
      5,
    )
  }

  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        expanded,
      }}
    >
      <DPEScenario
        {...{
          rules,
          engine,
          situation,
          setSearchParams,
          answeredQuestions,
        }}
      />
      <Card
        css={`
          background: #f4efff;
          padding: calc(0.5rem + 1vw);
          h3 {
            margin: 0 0 0.5rem 0;
          }
        `}
      >
        <h3>
          <span aria-hidden="true">🔎</span> Un audit énergétique nécessaire
          pour MaPrimeRénov'
        </h3>
        <p>
          Obligatoire, avec une aide partielle pour le financer, cet audit est
          essentiel pour définir un projet adapté et maximiser vos aides.
        </p>
        <p>
          <strong>Coût moyen</strong> : Entre <strong>700 €</strong> et{' '}
          <strong>1 500 €</strong> (selon votre situation).
        </p>
        <p
          css={`
            margin-bottom: 1rem;
          `}
        >
          <strong>Aides disponibles</strong> : Une prise en charge de{' '}
          <Value
            {...{
              engine,
              situation,
              state: 'prime',
              dottedName: 'MPR . accompagnée . prise en charge MAR . montant',
            }}
          />
          .
        </p>
        <CTA
          $fontSize="normal"
          $importance="emptyBackground"
          css={
            isMobile &&
            `
              width: 100%;
              text-align: center;
            `
          }
        >
          <Link
            href={setSearchParams(
              {
                ...encodeSituation(
                  {
                    ...situation,
                    ['details']: 'MPR.accompagnée.prise en charge MAR',
                  },
                  false,
                  answeredQuestions,
                ),
              },
              'url',
              true,
            )}
          >
            En savoir plus sur l'aide <span aria-hidden="true">➞</span>
          </Link>
        </CTA>
      </Card>
      {/*  <Écrêtement {...{ engine, rules, situation }} /> */}
    </AideAmpleur>
  )
}
