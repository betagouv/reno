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
import { CTA, MiseEnAvant } from '@/components/UI'

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

      setResult(JSON.stringify(await response.json(), null, "\t"))
  };

  return (
    <>
      {(method === 'get' &&
        <MiseEnAvant>
          Pour la version GET, il faut sérialiser les paramètres de la
          simulation comme nous le faisons via la fonction{' '}
          <a href="https://github.com/betagouv/reno/blob/master/components/publicodes/situationUtils.ts#L55">
            encodeSituation
          </a>
          .
        </MiseEnAvant>
      )}
      <div css={`word-wrap: break-word;margin-bottom: 1rem;`}>
        <strong>URL: </strong>
        {method.toUpperCase() + " " + (method === 'get' ? getUrl : domain + '/api/')}
      </div>
      <div css={`display: flex;align-items: end;justify-content: space-between; width: 100%;margin-bottom: 1rem;`}>
        <div css={`width: 80%;`}>
          <strong css={`display: block`}>Paramètres:</strong>
          <TextArea
            css={`width: 100%`}
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
          />
        </div>
        <CTA
          onClick={(e) => handleSubmit(e, method)}
          css={`padding: 0.8rem 1.2rem;cursor: pointer;height: fit-content;`} 
        >
          Exécuter
        </CTA>
      </div>
      <div>
        <strong css={`display: block;`}>Résultat:</strong>
        <code css={`display: block; padding: 1rem; background: black; color: white; min-width: 100%;`}>
          <pre>{result}</pre>
        </code>
      </div>
    </>
  )
}

export const TextArea = styled.textarea`
  padding: 0.6rem;
  font-size: 100%;
  width: 25rem;
  height: 15rem;
  border: 2px solid var(--color);
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
