'use client'

import DPELabel from '@/components/DPELabel'
import { Card } from '@/components/UI'
import getAppUrl from '@/components/getAppUrl'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Schema from './AmpleurSchema'
import { mobileIframeStyle } from './ExampleIframe'
import personas from './examplePersonas.yaml'
import { BlueEm } from '../LandingUI'

const iframeCode = (
  src = 'https://mesaidesreno.beta.gouv.fr/module/integration',
  cssExample = false,
) => `
<iframe src="${src}" ${
  cssExample
    ? `
style="width: 720px; height: 800px; margin: 3rem auto; display: block; border-radius: 0.4rem; --shadow-color: 0deg 0% 63%;
              --shadow-elevation-medium: 0.3px 0.5px 0.7px
                  hsl(var(--shadow-color) / 0.36),
                0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
                2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
                5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
              box-shadow: var(--shadow-elevation-medium);

"
`
    : ''
}></iframe>
`

export default function AmpleurDemonstration() {
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0 } = searchParams
  const personaSituation = personas[selectedPersona].situation
  const iframeSearchParams = encodeSituation(personaSituation, true)
  const iframeUrl =
    getAppUrl() +
    '/module/integration?' +
    new URLSearchParams(iframeSearchParams).toString()

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
                    <small>
                      Construit en :{' '}
                      {situation['logement . année de construction'] || '?'}
                    </small>
                    <div>
                      DPE : <DPELabel index={situation['DPE . actuel'] - 1} />
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p>
          Voici la liste des champs qui peuvent être injectés dans l'iframe :
        </p>
        <Schema />
        <h3>L'URL de l'iframe à injecter de votre côté</h3>
        <p>
          Voici{' '}
          <BlueEm>
            <strong>le code à intégrer</strong>
          </BlueEm>{' '}
          dans votre HTML ou votre contenu Wordpress :
        </p>
        <code
          css={`
            word-break: break-all;
          `}
        >
          {iframeCode(iframeUrl, false)}
        </code>
        <p
          css={`
            margin-top: 1rem;
          `}
        >
          Vous pouvez habiller le module en CSS avec par exemple une ombre
          portée, voici un exemple :{' '}
        </p>
        <code
          css={`
            word-break: break-all;
          `}
        >
          {iframeCode(undefined, true)}
        </code>
        <section
          css={`
            margin: auto;
          `}
        >
          <h3>Le module de simulation que verra l'usager sur écran large</h3>
          <iframe
            src={iframeUrl}
            css={`
              border: none;
              border-radius: 0.4rem;
              margin: 3rem auto;
              height: 780px;
              width: 50rem;
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
          <iframe src={iframeUrl} css={mobileIframeStyle}></iframe>
        </section>
      </div>
    </section>
  )
}
