import rules from '@/app/règles/rules'
import DPEScenario from '@/components/mpra/DPEScenario'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'
import { Card } from '../UI'
import Value from '../Value'
import AideAmpleur from './AideAmpleur'

export default function MPRA({
  isEligible,
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  expanded,
}) {
  const dottedName = 'MPR . accompagnée'
  const isTMO =
    engine.setSituation(situation).evaluate('ménage . revenu . classe')
      .nodeValue == 'très modeste'

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
      {!isTMO && (
        <div className="fr-alert fr-alert--info fr-mb-5v">
          <div className="fr-alert__title">
            Qui peut avoir MaPrimeRénov’ parcours accompagné ?
          </div>
          <p>
            Jusqu'au 31 décembre 2025 seuls les ménages très modestes peuvent en
            bénéficier. L’aide pourrait réouvrir aux autres catégories de
            revenus début 2026.
          </p>
        </div>
      )}
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
              dottedName: 'MPR . accompagnée . prise en charge MAR . montant',
            }}
          />
          .
        </p>
        <Link
          className="fr-btn fr-btn--secondary"
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
      </Card>
      {/*  <Écrêtement {...{ engine, rules, situation }} /> */}
    </AideAmpleur>
  )
}
