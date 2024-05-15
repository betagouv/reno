import { Value } from '../ScenariosSelector'
import { Card } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'

import Link from 'next/link'
import { PrimeStyle } from '../Geste'
import ExplicationAngers from './locales/ExplicationAngers'

export default function ExplicationsMPRA({
  engine,
  situation,
  choice,
  setSearchParams,
}) {
  return (
    <Card
      css={`
        background: transparent;
        border: none;
        border-left: 3px solid #dfdff1;
        border-radius: 0;
        padding: 0rem 0 0rem 0.8rem;
        margin: 2vh 0 3vh;
      `}
    >
      <h4
        css={`
          text-align: left;
          margin: 0rem 0 0.8rem 0;
          color: gray;
          font-weight: 400;
        `}
      >
        Explications
      </h4>
      <ol
        css={`
          list-style-type: circle;
          li {
            margin-bottom: 1rem;
          }
        `}
      >
        <li>
          <Etat {...{ engine, situation, choice }} />
        </li>

        <li>
          <ExplicationAngers {...{ engine, situation, choice }} />
        </li>
      </ol>
      <Link
        title="Comprendre le calcul en détail"
        css={`
          position: absolute;
          right: 0.4rem;
          bottom: 0.2rem;
          color: #ccc;
        `}
        href={setSearchParams(
          encodeSituation(situation),
          'url',
          true,
          'documentation/aides',
        )}
      >
        ?
      </Link>
    </Card>
  )
}

const Etat = ({ engine, situation, choice }) => (
  <section>
    <div>Aide de l'État :</div>
    <div>
      <Value
        {...{
          engine,
          index: choice,
          situation: {
            ...situation,
            'projet . DPE visé': choice + 1,
          },
          dottedName: 'MPR . accompagnée . pourcent dont bonus',
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
          dottedName: 'projet . travaux . plafond',
        }}
      />{' '}
      de travaux, soit jusqu'à{' '}
      <PrimeStyle>
        <Value
          {...{
            engine,
            index: choice,
            situation: {
              ...situation,
              'projet . travaux': 999999,
              'projet . DPE visé': choice + 1,
            },
            dottedName: 'MPR . accompagnée . montant',
          }}
        />
      </PrimeStyle>
      .
    </div>
  </section>
)
