'use client'
import css from '@/components/css/convertToJs'
import { PersonasList } from '@/components/InputUI'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import { Card, Main, Section } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import personas from './personas.yaml'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import { colors } from '@/components/Result'

const engine = new Publicodes(rules)
export default function Personas({}) {
  const setSearchParams = useSetSearchParams()

  return (
    <Main>
      <Section>
        <h1>Tester un persona</h1>
        <PersonasList>
          <ul>
            {personas.map((persona) => {
              const newEngine = engine.setSituation(persona.situation)
              const mpra = newEngine.evaluate('MPR . accompagnée')
              const mprg = newEngine.evaluate('MPR . non accompagnée')
              const mpraValue = formatValue(mpra, { precision: 0 }),
                mprgValue = mprg.nodeValue && mprg.nodeValue > 1

              return (
                <li key={persona.nom}>
                  <Card>
                    <h3>{persona.nom}</h3>
                    <small
                      css={`
                        line-height: 1rem;
                      `}
                    >
                      {persona.description}
                    </small>
                    <small
                      css={`
                        display: flex;
                        justify-content: space-between;
                        line-height: 1.3rem;
                      `}
                    >
                      MPR accompagnée
                      <ResultLabel binary={mpra.nodeValue > 0}>
                        {mpraValue}
                      </ResultLabel>
                    </small>
                    <small
                      css={`
                        display: flex;
                        line-height: 1.3rem;
                        justify-content: space-between;
                      `}
                    >
                      MPR gestes
                      <ResultLabel binary={mprg.nodeValue > 0}>
                        {mprgValue ? 'oui' : 'non'}
                      </ResultLabel>
                    </small>
                    <div>
                      <Link
                        href={setSearchParams(
                          encodeSituation(
                            persona.situation,
                            false,
                            Object.keys(persona.situation),
                          ),
                          'url',
                          true,
                          `simulation`,
                        )}
                      >
                        Injecter
                      </Link>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        </PersonasList>
      </Section>
    </Main>
  )
}

const ResultLabel = ({ binary, children }) => (
  <span
    css={`
      margin-left: 0.4rem;
      padding: 0 0.4rem;
      ${binary
        ? `background: ${colors.success.lightBackground}; border: 1px solid ${colors.success.background}`
        : `background: ${colors.fail.lightBackground}; border: 1px solid ${colors.fail.background}
								`}
    `}
  >
    {children}
  </span>
)
