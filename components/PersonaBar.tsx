'use client'
import { useEffect, useMemo, useState } from 'react'
import personas from '@/app/personas.yaml'
import personaNames from '@/app/personaNames.yaml'
import { Card, PrimeStyle } from './UI'
import PersonaInjection from '@/app/PersonaInjection'
import enrichSituation from './personas/enrichSituation'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import { computeAideStatus } from './ampleur/AmpleurSummary'
import StatusIcon from './ampleur/StatusIcon'

const matrixLines = [
  'MPR . accompagnée',
  'aides locales',
  'ampleur . prime individuelle copropriété',
  "CEE . rénovation d'ampleur",
  'taxe foncière',
  'denormandie',
  'PTZ',
  'PAR',
]
export default function PersonaBar({ startShown = false, selectedPersona }) {
  const [shown, show] = useState(startShown)
  const [enrichedPersonas, setEnrichedPersonas] = useState(personas)

  const engine = useMemo(() => {
    return new Publicodes(rules)
  }, [])

  useEffect(() => {
    const listener = (e) => {
      if (e.shiftKey && e.key === 'P') {
        show((shown) => !shown)
      }
    }
    document.addEventListener('keypress', listener)
    return () => {
      document.removeEventListener('keypress', listener)
    }
  }, [show])

  useEffect(() => {
    if (!engine || !shown) return

    const doEnrich = async () => {
      personas.forEach(async (persona, index) => {
        const enrichedSituation = await enrichSituation(persona.situation)

        const evaluations = matrixLines.map((dottedName) =>
          engine
            .setSituation(enrichedSituation)
            .evaluate(dottedName + ' . montant'),
        )

        const newPersona = {
          ...persona,
          situation: enrichedSituation,
          evaluations,
        }

        setEnrichedPersonas((personas) =>
          personas.map((persona, index2) =>
            index2 === index ? newPersona : persona,
          ),
        )
      })
    }
    doEnrich()
  }, [setEnrichedPersonas, engine, shown])

  if (!shown) return
  return (
    <section
      css={`
        position: fixed;
        z-index: 1000;
        margin-bottom: 10rem;
        background: white;
        width: 100vw;
        left: 0;
        top: 0;
        ol {
          list-style-type: none;
        }
        filter: drop-shadow(0 1px 3px rgba(0, 0, 18, 0.16));
      `}
    >
      <ul
        css={`
          margin-left: 12rem;
          white-space: nowrap;
          height: 21.4rem;
          display: flex;
          align-items: start;
          overflow: scroll;
          list-style-type: none;
          padding-left: 0;
          > li {
            min-height: 12rem;
            height: 12rem;
            margin: 0 0.6rem;
            min-width: 10rem;
            white-space: wrap;
            small {
              max-height: 6rem;
              display: block;
              overflow: hidden;
            }
          }
        `}
      >
        {enrichedPersonas.map((persona, personaIndex) => (
          <li
            key={persona.description}
            css={`
              > div {
                padding: 0.2rem 0.4rem;
                min-height: 9rem;
                height: 9rem;
                justify-content: space-between;
                display: flex;
                flex-direction: column;
              }
              ${selectedPersona == personaIndex &&
              `
			  > div{border: 2px solid var(--color); background: var(--lighterColor2)}`}
            `}
          >
            <Card>
              <div>{personaNames[personaIndex]}</div>
              <div>
                <small>{persona.description}</small>
              </div>
              <PersonaInjection
                persona={persona}
                keepPersonaBar={true}
                personaIndex={personaIndex}
                enrichedSituation={persona.situation}
              />
            </Card>
            {persona.evaluations && (
              <section>
                <ol>
                  {persona.evaluations.map((evaluation) => {
                    const value = formatValue(evaluation)
                    const { dottedName, nodeValue } = evaluation
                    const status = computeAideStatus(evaluation)
                    return (
                      <li
                        key={dottedName}
                        css={`
                          img {
                            width: 1rem;
                            height: auto;
                            vertical-align: middle;
                          }
                          > span {
                            font-size: 75%;
                          }
                        `}
                      >
                        <StatusIcon status={status} />{' '}
                        {status && <PrimeStyle>{value}</PrimeStyle>}
                      </li>
                    )
                  })}
                </ol>
              </section>
            )}
          </li>
        ))}
      </ul>
      <section
        css={`
          position: fixed;
          top: 10rem;
          left: 0.6rem;
          ol {
            display: flex;
            flex-direction: column;
            li {
              margin: 0.05rem 0;
              small {
                max-width: 12rem;
                line-height: 0.8rem;
                display: inline-block;
              }
            }
          }
        `}
      >
        <ol>
          {matrixLines
            .map((dottedName) => ({ ...rules[dottedName], dottedName }))
            .map((rule) => {
              return (
                <li key={rule.dottedName}>
                  <small>{rule.marque}</small>
                </li>
              )
            })}
        </ol>
      </section>
      <div css="position: absolute; bottom: -2.4rem; left: 50%; transform: translateX(-50%); padding: .2rem 1rem; border-radius: .4rem; background: yellow; width: 20rem">
        Sélectionnez un persona ci-dessus
      </div>
    </section>
  )
}
