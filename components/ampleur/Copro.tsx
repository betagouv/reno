import rules from '@/app/règles/rules'
import AideAmpleur from './AideAmpleur'
import { Card, CTA, CTAWrapper } from '../UI'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import ConditionsWarning from './ConditionsWarning'

export default function Copro({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'ampleur . prime individuelle copropriété'

  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {expanded && (
        <>
          <ConditionsWarning
            {...{
              engine,
              dottedName,
              setSearchParams,
              situation,
              answeredQuestions,
            }}
          />
          <Card $background="#EEEEFF">
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
              , vous êtes éligible à une prime individuelle de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName:
                    'ampleur . prime individuelle copropriété . montant',
                  state: 'prime-black',
                }}
              />
              .
            </p>
          </Card>
          <p>
            L’aide MaPrimeRénov’ Copropriété finance 30 % ou 45 % du montant des
            travaux selon l’ambition de la rénovation énergétique, dans un
            plafond de 25 000 € par logement.
          </p>
          <p>
            Une prime supplémentaire est destinée aux copropriétaires aux
            ressources modestes et très modestes. Le montant de cette prime est
            respectivement de 1 500 € et de 3 000 €.
          </p>
          <h2
            css={`
              margin: 1rem 0;
            `}
          >
            Notre parcours dédié aux copropriétés
          </h2>
          <p>
            Simulez l'éligibilité de votre copropriété à MaPrimeRénov'
            Coproprieté grace a ce simulateur.
          </p>
          <CTAWrapper $justify="left">
            <CTA
              $fontSize="normal"
              $importance="secondary"
              css={`
                padding: 0.5rem 0;
              `}
            >
              <Link
                target="_blank"
                href={
                  '/copropriete/?' +
                  new URLSearchParams(encodeSituation(situation))
                }
              >
                ➞ &nbsp;Simuler MaPrimeRénov' copropriété
              </Link>
            </CTA>
          </CTAWrapper>
        </>
      )}
    </AideAmpleur>
  )
}
