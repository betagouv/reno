'use client'
import rules from '@/app/règles/rules'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import { colors } from '@/components/Result'
import { Card, Main, Section } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Image from 'next/image'
import Publicodes from 'publicodes'
import styled from 'styled-components'
import personaNames from './personaNames.yaml'
import personas from './personas.yaml'

const engine = new Publicodes(rules)
export default function Personas({}) {
  const setSearchParams = useSetSearchParams()

  return (
    <Main>
      <Section>
        <h1>Tester un persona</h1>
        <p>Ces personas constituent des profils fictifs de test. </p>
        <p>
          Certains sont complets : toutes les informations sont renseignées, les
          montants sont exacts. D'autres non (par exemple, on connait le DPE de
          départ, mais pas le DPE visé) : les aides sont alors calculées pour
          donner les <em>aides maximales</em>.
        </p>
        <PersonasList>
          <ul>
            {personas.map((persona, index) => {
              const newEngine = engine.setSituation({
                'simulation . mode': '"max"',
                ...persona.situation,
              })
              const mpra = newEngine.evaluate('MPR . accompagnée')
              const mprg = newEngine.evaluate('MPR . non accompagnée')
              const mpraValue = formatValue(mpra, { precision: 0 }),
                mprgValue = mprg.nodeValue && mprg.nodeValue > 1

              const tests = persona['valeurs attendues'],
                mpraTest = tests && tests['MPR . accompagnée']
              const correct = Math.round(mpra.nodeValue) === mpraTest
              const nom = personaNames[index]
              return (
                <li key={persona.description}>
                  <Card>
                    <h3>{nom}</h3>
                    <small
                      css={`
                        line-height: 1rem;
                        margin-bottom: 0.4rem;
                      `}
                    >
                      {persona.description}
                    </small>
                    <small
                      css={`
                        display: flex;
                        justify-content: space-between;
                        line-height: 1.3rem;
                        img {
                          width: 1.2rem;
                          height: auto;
                          vertical-align: bottom;
                          background: ${colors.success.lightBackground};
                          border-radius: 2rem;
                        }
                      `}
                    >
                      MPR acc.
                      <span>
                        <ResultLabel binary={mpra.nodeValue > 0}>
                          {mpraValue}
                        </ResultLabel>
                        {mpraTest &&
                          (correct ? (
                            <Image
                              src="/check.svg"
                              width="10"
                              height="10"
                              alt={
                                'La valeur calculée correspond à la valeur attendue'
                              }
                            />
                          ) : (
                            <span title="La valeur calculée ne correspond pas à la valeur attendue">
                              ❌
                            </span>
                          ))}
                      </span>
                    </small>
                    <small
                      css={`
                        display: flex;
                        line-height: 1.3rem;
                        justify-content: space-between;
                      `}
                    >
                      MPR gestes
                      <ResultLabel binary={mprgValue}>
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
      margin-right: 0.2rem;
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
export const PersonasList = styled.div`
  margin-top: 0.8rem;
  ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    padding: 0;
    display: flex;
    list-style-type: none;
    margin: 0.2rem 0;
    align-items: center;
    li {
      > div {
        width: 14rem;
        height: 12rem;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 0.4rem 0.6rem;
        h3 {
          margin: 0;
        }
      }
      margin: 0 0.6rem;
    }
  }
`
