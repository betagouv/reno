import rules from '@/app/règles/rules'
import { Card, Main, Section } from '@/components/UI'
import quoteIcon from '@/public/quote-remix.svg'
import Image from 'next/image'
import Publicodes from 'publicodes'
import PersonaInjection from './PersonaInjection'
import {
  PersonaStory,
  PersonaTests,
  PersonasList,
  ResultLabel,
  TestIcon,
} from './PersonasUI'
import personaNames from './personaNames.yaml'
import personas from './personas.yaml'
import css from '@/components/css/convertToJs'
import { personaTest } from '@/components/tests/personaTest'
import { getRuleTitle } from '@/components/publicodes/utils'
import Link from 'next/link'
import enrichSituation from '@/components/personas/enrichSituation'

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
            {personas.map((persona, personaIndex) => (
              <PersonaCard {...{ engine, persona, personaIndex }} />
            ))}
          </ul>
        </PersonasList>
      </Section>
    </Main>
  )
}

const PersonaCard = async ({ engine, persona, personaIndex }) => {
  const enrichedSituation = await enrichSituation(persona.situation)

  engine.setSituation({
    'simulation . mode': '"max"',
    ...enrichedSituation,
  })

  const nom = personaNames[personaIndex]
  const tests = Object.entries(persona['valeurs attendues'] || {}).map(
    ([dottedName, expectedValue]) =>
      personaTest(persona, nom, engine, dottedName, expectedValue),
  )
  const moreTests = Object.entries(
    persona['autres valeurs attendues'] || {},
  ).map(([dottedName, expectedValue]) =>
    personaTest(persona, nom, engine, dottedName, expectedValue),
  )

  return (
    <li key={persona.description}>
      <Card>
        <h3>{nom}</h3>
        <PersonaStory>
          <Image src={quoteIcon} alt="Icône citation" />
          {persona.description}
        </PersonaStory>
        <PersonaTests>
          {tests.map(
            ({ dottedName, correct, computedValue, formattedValue }) => {
              return (
                <li key={dottedName}>
                  <small
                    dangerouslySetInnerHTML={{
                      __html: getRuleTitle(dottedName, rules),
                    }}
                  />

                  <span
                    style={css`
                      margin-top: 0.4rem;
                      text-align: right;
                    `}
                  >
                    <ResultLabel
                      $binary={computedValue === 'oui' || computedValue > 0}
                    >
                      {formattedValue}
                    </ResultLabel>
                    {correct ? (
                      <TestIcon
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
            },
          )}
        </PersonaTests>
        {moreTests.length > 0 && (
          <small
            style={css`
              text-align: right;
            `}
          >
            {moreTests.length} autres tests&nbsp;
            <TestIcon
              src="/check.svg"
              width="10"
              height="10"
              style={css`
                vertical-align: sub;
              `}
              alt={'La valeur calculée correspond à la valeur attendue'}
            />
          </small>
        )}
        <div
          style={css`
            display: flex;
            justify-content: space-evenly;
          `}
        >
          <PersonaInjection
            persona={persona}
            personaIndex={personaIndex}
            enrichedSituation={enrichedSituation}
          />
          <Link href="https://github.com/betagouv/reno/blob/master/app/personas.yaml">
            Inspecter
          </Link>
        </div>
      </Card>
    </li>
  )
}
