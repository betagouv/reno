'use client'

import personas from './examplePersonas.yaml'
import Ampleur from './Ampleur'
import { Suspense } from 'react'
import getAppUrl from '@/components/getAppUrl'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { Card } from '@/components/UI'
import DPELabel from '@/components/DPELabel'
import { useSearchParams } from 'next/navigation'

export default function () {
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0 } = searchParams
  return (
    <section>
      <h2>Démonstration</h2>
      <div
        css={`
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          justify-content: start;
          align-items: start;
        `}
      >
        <h3>La situation d'entrée de votre plateforme d'annonce</h3>
        <div
          css={`
            max-width: 90vw;
            overflow: scroll hidden;
            white-space: nowrap;
            height: 12rem;
            scrollbar-width: none;
            ul {
              list-style-type: none;

              display: flex;
              align-items: center;
              gap: 1rem;
              li {
                min-width: 12rem;
                height: 10rem;
                white-space: wrap;
                a {
                  text-decoration: none;
                  color: inherit;
                  > div {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                  }
                }
              }
            }
          `}
        >
          <ul>
            {personas.map(({ nom, situation }, i) => (
              <li key={nom}>
                <Link
                  href={setSearchParams({ persona: i }, 'url')}
                  scroll={false}
                >
                  <Card
                    css={`
                      ${selectedPersona == i &&
                      `border: 2px solid var(--color)`}
                    `}
                  >
                    <div>{nom}</div>
                    <small>Logement de plus de 15 ans</small>
                    <div>
                      DPE : <DPELabel index={situation['DPE . actuel'] - 1} />
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <section
          css={`
            margin: auto;
            text-align: center;
          `}
        >
          <h3>Le module de simulation que verra l'usager sur écran large</h3>
          <iframe
            src={
              getAppUrl() +
              '/module/integration?' +
              new URLSearchParams(searchParams).toString()
            }
            css={`
              border: none;
              border-radius: 0.4rem;
              margin: 3rem auto;
              height: 800px;
              width: 40rem;
              max-width: 90vw;
              --shadow-color: 0deg 0% 63%;
              --shadow-elevation-medium: 0.3px 0.5px 0.7px
                  hsl(var(--shadow-color) / 0.36),
                0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
                2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
                5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
              box-shadow: var(--shadow-elevation-medium);
            `}
          ></iframe>
          <h3>... et sur écran mobile</h3>
          <iframe
            src={
              getAppUrl() +
              '/module/integration?' +
              new URLSearchParams(searchParams).toString()
            }
            css={`
              border: none;
              border-radius: 0.4rem;
              margin: 3rem auto;
              height: 800px;
              width: 370px;
              max-width: 90vw;
              --shadow-color: 0deg 0% 63%;
              --shadow-elevation-medium: 0.3px 0.5px 0.7px
                  hsl(var(--shadow-color) / 0.36),
                0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
                2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
                5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
              box-shadow: var(--shadow-elevation-medium);
            `}
          ></iframe>
        </section>
      </div>
    </section>
  )
}
