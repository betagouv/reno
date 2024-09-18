'use client'
import { useEffect, useMemo, useState } from 'react'
import personas from '@/app/personas.yaml'
import personaNames from '@/app/personaNames.yaml'
import { Card } from './UI'
import PersonaInjection from '@/app/PersonaInjection'
import enrichSituation from './personas/enrichSituation'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'

const matrixLines = ['taxe foncière . montant', 'denormandie . montant']
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
    if (!engine) return
    const doEnrich = async () => {
      personas.forEach(async (persona, index) => {
        const enrichedSituation = await enrichSituation(persona.situation)

        const evaluations = matrixLines.map((dottedName) =>
          engine.setSituation(enrichedSituation).evaluate(dottedName),
        )

        const newPersona = {
          ...persona,
          situation: enrichedSituation,
          evaluations,
        }
        console.log('lightred', 'did evaluate', newPersona)

        setEnrichedPersonas((personas) =>
          personas.map((persona, index2) =>
            index2 === index ? newPersona : persona,
          ),
        )
      })
    }
    doEnrich()
  }, [setEnrichedPersonas, engine])

  console.log('lightred', enrichedPersonas)
  if (!shown) return
  return (
    <section
      css={`
        position: fixed;
        margin-bottom: 10rem;
        background: var(--lightColor);
        width: 100vw;
        left: 0;
        top: 0;
        overflow: hidden;
        ol {
          list-style-type: none;
        }
      `}
    >
      <ul
        css={`
          margin-left: 12rem;
          white-space: nowrap;
          height: 14rem;
          display: flex;
          align-items: center;
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
                justify-content: space-between;
                display: flex;
                flex-direction: column;
              }
              ${selectedPersona == personaIndex &&
              `
			  > div{border: 2px solid var(--color); background: var(--lighterColor)}`}
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
                    return (
                      <li key={dottedName}>
                        {!nodeValue || isNaN(nodeValue) ? (
                          <span
                            css={`
                              opacity: 0.3;
                            `}
                          >
                            Non applicable
                          </span>
                        ) : (
                          value
                        )}
                      </li>
                    )
                  })}
                </ol>
              </section>
            )}
          </li>
        ))}
      </ul>
      <section>
        <ol
          css={`
            ul {
              display: flex;
              flex-direction: column;
            }
          `}
        >
          {matrixLines.map((dottedName) => (
            <li key={dottedName}>{dottedName.replace(' . montant', '')}</li>
          ))}
        </ol>
      </section>
    </section>
  )
}
