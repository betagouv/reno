'use client'
import { useMemo, useState } from 'react'
import { parse, stringify } from 'yaml'
import personas from '@/app/personas.yaml'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import { useDebounce } from 'use-debounce'
import styled from 'styled-components'
import { Card } from '@/components/UI'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const [yaml, setYaml] = useState(stringify(personas[0].situation))
  const [debouncedYaml] = useDebounce(yaml, 500)

  const mpra = useMemo(() => {
    console.log('memo')
    try {
      const json = parse(debouncedYaml)
      const evaluation = engine
        .setSituation(json)
        .evaluate('MPR . accompagnée . montant')
      return formatValue(evaluation, { precision: 0 })
    } catch (e) {
      console.log(e)
      return e
    }
  }, [debouncedYaml])

  return (
    <div
      css={`
        margin: 2rem 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
      `}
    >
      <h3>Les données d'entrée de votre plateforme d'annonce</h3>
      <section>
        <TextArea
          value={yaml}
          onChange={(e) => console.log('onchange') || setYaml(e.target.value)}
        />
        <h3>Le module de simulation que verra l'usager</h3>
        <Card
          css={`
            h2 {
              margin-top: 0;
            }
          `}
        >
          <h2>Aide à la rénovation d'ampleur</h2>
          <ul>
            <li>Pas pour résidence secondaire</li>
            <li>
              <input placeholder="Votre revenu" />
            </li>
            <li>
              <input placeholder="Votre revenu" />
            </li>
            <li>Ile de France ?</li>
          </ul>
          <EvaluationValue>
            <small>MaPrimeRénov' accompagnée</small>{' '}
            <div>
              {typeof mpra === 'string' ? mpra : <p>{mpra.toString()}</p>}
            </div>
          </EvaluationValue>
        </Card>
      </section>
    </div>
  )
}

export const TextArea = styled.textarea`
  padding: 0.6rem;
  font-size: 110%;
  width: 25rem;
  height: 10rem;
  border: 2px solid var(--color);
  margin-right: 2rem;
`

export const EvaluationValue = styled.div`
  background: var(--color);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  small {
    margin-bottom: 0.4rem;
  }
`
