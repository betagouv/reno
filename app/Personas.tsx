'use client'
import css from '@/components/css/convertToJs'
import { PersonasList } from '@/components/InputUI'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import { Card, Main, Section } from '@/components/UI'
import useSetSeachParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import personas from './personas.yaml'

export default function Personas({}) {
  const setSearchParams = useSetSeachParams()
  return (
    <Main>
      <Section>
        <h1>Tester un persona</h1>
        <PersonasList>
          <ul>
            {personas.map((persona) => (
              <li key={persona.nom}>
                <Card>
                  <h3>{persona.nom}</h3>
                  <small>{persona.description}</small>
                  <div>
                    <Link
                      href={setSearchParams(
                        encodeSituation(
                          persona.situation,
                          false,
                          Object.keys(persona.situation),
                        ),
                        true,
                        true,
                        `simulation`,
                      )}
                    >
                      Injecter
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </PersonasList>
      </Section>
    </Main>
  )
}
