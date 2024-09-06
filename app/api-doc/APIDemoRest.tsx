'use client'
import { useMemo, useState } from 'react'
import { parse, stringify } from 'yaml'
import rules from '@/app/règles/rules'
import styled from 'styled-components'
import example from '@/app/api-doc/api-example.yaml'
import getAppUrl from '@/components/getAppUrl'
import { encodeDottedName, encodeSituation } from '@/components/publicodes/situationUtils'
import { CTA, MiseEnAvant } from '@/components/UI'
import { omit } from '@/components/utils'

export default function APIDemoRest({type, method = 'POST' }) {
  const [result, setResult] = useState("")
  const [yaml, setYaml] = useState(stringify(example[type]))
  const [geste, setGeste] = useState('gestes . chauffage . PAC . air-eau')
  const [gesteCee, setGesteCee] = useState('gestes . isolation . murs extérieurs')

  const ruleToEvaluate = {
    mprg : `${geste} . MPR . montant`,
    copropriete : 'copropriété . montant',
    cee : `${gesteCee} . CEE . montant`,
    "category-mpr" : 'ménage . revenu . classe',
    mpra : 'MPR . accompagnée . montant'
  }

  const typeGeste = type == "mprg" ? "MPR" : "CEE"
  const distinctRules = Object.keys(rules)
                                 .filter((item) => item.startsWith('gestes') && item.endsWith(typeGeste))
                                 .map((item) => ({
                                    valeur: item.replace(` . ${typeGeste}`, ''),
                                    titre: rules[item.replace(` . ${typeGeste}`, '')].titre
                                  }))

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
  const apiUrl = domain + '/api/?' +
                 new URLSearchParams(method === "GET" ? searchParams : {"fields": encodeDottedName(ruleToEvaluate[type])}).toString()

  const handleSubmit = async (e) => {
      e.preventDefault();
      let params =  {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
      }
      if(method === "POST") {
        params["body"] = JSON.stringify(situation)
      }
      const response = await fetch(apiUrl, params);

      setResult(JSON.stringify(await response.json(), null, "\t"))
  };

  const changeGeste = (e) => {
    if(typeGeste == "MPR") {
      setGeste(e.target.value) 
    } else {
      setGesteCee(e.target.value)
    }
    
    let newYaml = Object.values(yaml.split("\n").map((line) => line.split(":")))
                        .reduce((acc, [key, value]) => {
                          if(!value) {
                            return acc;
                          }
                          acc[key.trim()] = value.trim().replace(/^["\s]+|["\s]+$/g, '');
                          return acc;
                        }, {});
    console.log("newYaml", newYaml)
    newYaml = omit([typeGeste == "MPR" ? geste : gesteCee], newYaml)
    newYaml[e.target.value] = "oui"
    
    setYaml(stringify(newYaml))
  }

  return (
    <>
      {(method === 'GET' &&
        <MiseEnAvant>
          Il faut sérialiser les paramètres passer via l'url en utilisant la fonction{' '}
          <a href="https://github.com/betagouv/reno/blob/master/components/publicodes/situationUtils.ts#L55">
            encodeSituation
          </a>
          .
        </MiseEnAvant>
      )}
      <div css={`word-wrap: break-word;margin-bottom: 1rem;`}>
        <strong>URL: </strong>
        {method.toUpperCase() + " " + apiUrl}
      </div>
      {["mprg", "cee"].includes(type) && (
        <div css={`margin-bottom: 1rem`}>
          Geste : {` `}
          <Select
            onChange={(e) => changeGeste(e)}
            value={typeGeste == "MPR" ? geste : gesteCee}
          >
            {distinctRules.map((item, index) => (
              <option key={index} value={item.valeur} disabled={item.valeur === ""}>
                {item.titre}
              </option>
            ))}
          </Select>
        </div>
      )}
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
  height: 10rem;
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

export const Select = styled.select`
  appearance: none;
  line-height: 1.5rem;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  box-shadow: inset 0 -2px 0 0 #3a3a3a;
  border: none;
  background-color: #eee;
  color: #3a3a3a;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23161616' d='m12 13.1 5-4.9 1.4 1.4-6.4 6.3-6.4-6.4L7 8.1z'/%3E%3C/svg%3E");
  background-position: calc(100% - 0.5rem) 50%;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  border-radius: 0.25rem 0.25rem 0 0;
`