import rules from '@/app/règles/rules'
import { Card, Main, Section } from '@/components/UI'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import quoteIcon from '@/public/quote-remix.svg'
import Image from 'next/image'
import Publicodes from 'publicodes'
import PersonaInjection from './PersonaInjection'
import {
  PersonaStory,
  PersonaTests,
  PersonasList,
  ResultLabel,
} from './PersonasUI'
import personaNames from './personaNames.yaml'
import personas from './personas.yaml'
import css from '@/components/css/convertToJs'

const engine = new Publicodes(rules)
export default function Personas({}) {
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
        <p>
          💡 Cette page ne peut en principe pas contenir de test erroné, car un
          seul test qui ne passe pas empêche le déploiement de Mes Aides Réno.
        </p>
        <PersonasList>
          <ul>
            {personas.map((persona, index) => {
              const newEngine = engine.setSituation({
                'simulation . mode': '"max"',
                ...persona.situation,
              })

              const tests = Object.entries(persona['valeurs attendues'] || {})
              const nom = personaNames[index]
              return (
                <li key={persona.description}>
                  <Card>
                    <h3>{nom}</h3>
                    <PersonaStory>
                      <Image src={quoteIcon} alt="Icône citation" />
                      {persona.description}
                    </PersonaStory>
                    <PersonaTests>
                      {tests.map(([dottedName, expectedValue]) => {
                        const rule = rules[dottedName]
                        const evaluation = newEngine.evaluate(dottedName),
                          computedValue = evaluation.nodeValue,
                          formattedValue = formatValue(evaluation, {
                            precision: 0,
                          })
                        console.log(
                          nom,
                          dottedName,
                          expectedValue,
                          computedValue,
                          formattedValue,
                        )
                        const correct =
                          typeof expectedValue === 'number'
                            ? Math.round(computedValue) === expectedValue
                            : ['oui', 'non'].includes(expectedValue)
                              ? expectedValue === formattedValue
                              : typeof expectedValue === 'string'
                                ? formattedValue === expectedValue
                                : undefined

                        if (correct === undefined)
                          throw new Error(
                            'Failing test because of incorrect type recognition',
                          )
                        if (correct === false) {
                          console.log('Failing persona', persona)
                          throw new Error('Failing test !! ' + nom)
                        }
                        return (
                          <li key={dottedName}>
                            <small
                              dangerouslySetInnerHTML={{
                                __html:
                                  rule.titreHtml || rule.titre || dottedName,
                              }}
                            />

                            <span
                              style={css`
                                margin-top: 0.4rem;
                                text-align: right;
                              `}
                            >
                              <ResultLabel
                                $binary={
                                  computedValue === 'oui' || computedValue > 0
                                }
                              >
                                {formattedValue}
                              </ResultLabel>
                              {correct ? (
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
                              )}
                            </span>
                          </li>
                        )
                      })}
                    </PersonaTests>
                    <div>
                      <PersonaInjection persona={persona} />
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
