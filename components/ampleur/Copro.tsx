import rules from '@/app/règles/rules'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { compute } from '../explications/Aide'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import DPELabel from '../DPELabel'
import MapBehindCTA from '../MapBehindCTA'
import { BlueEm } from '@/app/LandingUI'
import { Card, CTA, CTAWrapper, ExternalLink } from '../UI'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import checkIcon from '@/public/check.svg'

export default function Copro({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'ampleur . prime individuelle copropriété'
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  const isTrèsModeste = evaluation.value === 'très modeste'

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
          <h3>Comment est calculée l'aide ?</h3>
          <Card $background="#f7f8f8">
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
          <h3>Notre parcours dédié aux copropriétés</h3>
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
