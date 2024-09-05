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
import { CTA } from '@/components/UI'

export default function APIDemo({ yaml, method = 'get' }) {
  const [result, setResult] = useState("")
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
  const getUrl = domain + '/api/' + '?' + new URLSearchParams(searchParams).toString()
  
  const handleSubmit = async (e) => {
      e.preventDefault();

      const response = await fetch(domain + '/api/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(situation),
      });

      setResult(JSON.stringify(await response.json()))
  };

  return (
    <>
      <h4>Méthode {method.toUpperCase()}</h4>
      {(method === 'get' &&
        <p>
          Pour la version GET, il faut sérialiser les paramètres de la
          simulation comme nous le faisons via la fonction{' '}
          <a href="https://github.com/betagouv/reno/blob/master/components/publicodes/situationUtils.ts#L55">
            encodeSituation
          </a>
          .
        </p>
      )}
      <div css={`display: flex;align-items: center;justify-content: space-between; width: 100%;`}>
        <div css={`width: 80%;word-wrap: break-word;`}>{method.toUpperCase() + " " + (method === 'get' ? getUrl : domain + '/api/')}</div>
        <CTA
          onClick={(e) => handleSubmit(e, method)}
          css={`padding: 0.8rem 1.2rem;cursor: pointer;word-break: break-word;`} 
        >
          Exécuter
        </CTA>
      </div>
      <div>
        Paramètres:<br />
        <TextArea
          value={yaml}
          onChange={(e) => setYaml(e.target.value)}
        />
      </div>
      <div>
        Résultat:
        {result}
      </div>
    </>
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
