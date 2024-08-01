'use client'
import { useMemo, useState } from 'react'
import { parse, stringify } from 'yaml'
import personas from '@/app/personas.yaml'
import rules from '@/app/règles/rules'

import { useDebounce } from 'use-debounce'
import styled from 'styled-components'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import getAppUrl from '@/components/getAppUrl'
import { encodeSituation } from '@/components/publicodes/situationUtils'

export default function APIDemo({ personaIndex = 0, method = 'get' }) {
  const [yaml, setYaml] = useState(stringify(personas[personaIndex].situation))
  //const [debouncedYaml] = useDebounce(yaml, 500)

  const domain = getAppUrl()

  const situation = useMemo(() => {
    try {
      const json = parse(yaml)
      return json
    } catch (e) {
      console.log(e)
      return {}
    }
  }, [yaml])

  const searchParams = encodeSituation(situation)
  const getUrl =
    domain + '/api/' + '?' + new URLSearchParams(searchParams).toString()
  const postUrl = 'voila'

  return (
    <section
      css={`
        margin: 2rem 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
      `}
    >
      <TextArea
        value={yaml}
        onChange={(e) => console.log('onchange') || setYaml(e.target.value)}
      />
      {method === 'get' ? (
        <Link href={getUrl}>URL d'API GET</Link>
      ) : (
        <button>Test de l'URL POST</button>
      )}
    </section>
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
