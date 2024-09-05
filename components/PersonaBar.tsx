'use client'
import { useEffect, useState } from 'react'
import personas from '@/app/personas.yaml'
import personaNames from '@/app/personaNames.yaml'
import { Card } from './UI'
import PersonaInjection from '@/app/PersonaInjection'

export default function PersonaBar({ startShown = false, selectedPersona }) {
  const [shown, show] = useState(startShown)

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
        ul {
          white-space: nowrap;
          height: 12rem;
          display: flex;
          align-items: center;
          overflow: scroll;
          list-style-type: none;
          padding-left: 0;
          li {
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
        }
      `}
    >
      <ul>
        {personas.map((persona, personaIndex) => (
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
			  > div{border: 2px solid var(--color)}`}
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
              />
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
