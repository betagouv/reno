import { Value } from '@/components/ScenariosSelector'

const Base = ({ engine, situation, choice, showTotal }) => (
  <span>
    <Value
      {...{
        engine,
        index: choice,
        situation: {
          ...situation,
          'projet . DPE visé': choice + 1,
        },
        dottedName: 'aides locales . angers . aides socles . taux',
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
        dottedName:
          'aides locales . angers . aides socles . plafond de travaux HT',
      }}
    />{' '}
    de travaux
    {showTotal ? (
      <span>
        , soit une aide complémentaire maximum de{' '}
        <Value
          {...{
            engine,
            index: choice,
            situation: {
              ...situation,

              'projet . travaux': 999999,
              'projet . DPE visé': choice + 1,
            },
            dottedName: 'aides locales . angers . aides socles . montant',
            state: 'prime-secondary',
          }}
        />
        .
      </span>
    ) : null}
  </span>
)

// This should be generalised to any local subvention
export default function ExplicationAngers({ engine, situation, choice }) {
  const conditionBBCAngers = engine
    .setSituation({ ...situation, 'projet . DPE visé': choice + 1 })
    .evaluate(
      'aides locales . angers . prime basse consommation . conditions',
    ).nodeValue

  return (
    <section>
      <span>
        Aide{conditionBBCAngers ? 's' : ''} d'Angers Métropole jusqu'à{' '}
        <Value
          {...{
            engine,
            index: choice,
            situation: {
              ...situation,
              'projet . travaux': 999999,
              'projet . DPE visé': choice + 1,
            },
            dottedName: 'aides locales . angers . aides',
            state: 'prime-secondary',
          }}
        />{' '}
        :
      </span>
      {conditionBBCAngers ? (
        <ul>
          <li>
            <Base {...{ engine, situation, choice, showTotal: true }} />
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
                    'aides locales . angers . prime basse consommation . montant',
                  state: 'prime-secondary',
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
