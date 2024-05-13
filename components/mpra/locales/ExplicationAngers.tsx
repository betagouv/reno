import { Value } from '@/components/ScenariosSelector'

const Base = ({ engine, situation, choice }) => (
  <p>
    <Value
      {...{
        engine,
        index: choice,
        situation: {
          ...situation,
          'projet . DPE visé': choice + 1,
        },
        dottedName: "métropole d'Angers . aides socles . taux",
      }}
    />
    du coût de vos travaux avec un plafond de{' '}
    <Value
      {...{
        engine,
        index: choice,
        situation: {
          ...situation,
          'projet . DPE visé': choice + 1,
        },
        dottedName: "métropole d'Angers . aides socles . plafond de travaux HT",
      }}
    />{' '}
    de travaux, soit une aide complémentaire maximum de{' '}
    <Value
      {...{
        engine,
        index: choice,
        situation: {
          ...situation,

          'projet . travaux': 999999,
          'projet . DPE visé': choice + 1,
        },
        dottedName: "métropole d'Angers . aides socles . montant",
      }}
    />
    .
  </p>
)

// This should be generalised to any local subvention
export default function ExplicationAngers({ engine, situation, choice }) {
  const conditionBBCAngers = engine
    .setSituation({ ...situation, 'projet . DPE visé': choice + 1 })
    .evaluate(
      "métropole d'Angers . prime basse consommation . conditions",
    ).nodeValue

  return (
    <section>
      Aide{conditionBBCAngers ? 's' : ''} de la métropole d'Angers :
      {conditionBBCAngers ? (
        <ul>
          <li>
            <Base {...{ engine, situation, choice }} />
          </li>
          {conditionBBCAngers && (
            <li>
              Un bonus bâtiment basse consommation (BBC) de{' '}
              <Value
                {...{
                  engine,
                  index: choice,
                  situation: {
                    ...situation,

                    'projet . DPE visé': choice + 1,
                  },
                  dottedName:
                    "métropole d'Angers . prime basse consommation . montant",
                }}
              />
              .
            </li>
          )}
        </ul>
      ) : (
        <Base {...{ engine, situation, choice }} />
      )}
    </section>
  )
}
