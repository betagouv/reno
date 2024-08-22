import { Value } from '../ScenariosSelector'
import { Card } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'

import Link from 'next/link'
import ExplicationAngers from './locales/ExplicationAngers'

export default function ExplicationsMPRA({
  engine,
  situation,
  choice,
  setSearchParams,
}) {
  const locales = engine
      .setSituation(situation)
      .evaluate('aides locales . total').nodeValue,
    hasLocales = locales > 0

  const angers = engine.evaluate('aides locales . angers . aides').nodeValue,
    hasAngers = angers > 0

  return (
    <section
      css={`
        background: transparent;
        border: none;
        details summary + * {
          margin-top: 1rem;
          border-left: 3px solid #dfdff1;
          border-radius: 0;
          padding: 0rem 0 0rem 0.8rem;
        }
        summary {
          text-align: right;
          h4 {
            display: inline;
          }
        }
      `}
    >
      <details>
        <summary>
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
        </summary>
        {hasLocales ? (
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
        ) : (
          <Etat {...{ engine, situation, choice }} />
        )}
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
      </details>
    </section>
  )
}

const Etat = ({ engine, situation, choice }) => (
  <section>
    <span>
      Aide de l'État jusqu'à{' '}
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
          state: 'prime-secondary',
        }}
      />{' '}
      :
    </span>
    <span>
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
      de travaux.
    </span>
  </section>
)
