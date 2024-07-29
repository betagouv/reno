'use client'
import { useEffect, useState } from 'react'
import personas from '@/app/personas.yaml'
import personaNames from '@/app/personaNames.yaml'
import { Card } from './UI'
import PersonaInjection from '@/app/PersonaInjection'

export default function PersonaBar() {
  const [shown, show] = useState(false)

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
        overflow: hidden;
        width: 90%;
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
        {personas.map((persona, i) => (
          <li key={persona.description}>
            <Card>
              <div>{personaNames[i]}</div>
              <div>
                <small>{persona.description}</small>
              </div>
              <PersonaInjection persona={persona} />
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
