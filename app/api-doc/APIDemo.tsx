'use client'
import { useMemo, useState } from 'react'
import { parse, stringify } from 'yaml'
import example from '@/app/api-doc/api-example.yaml'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import { useDebounce } from 'use-debounce'
import styled from 'styled-components'
import APIDemoRest from './APIDemoRest'
import { TabHeader, TabHeaders, TabPanel, Tabs } from '@/components/UI'

const engine = new Publicodes(rules)
export default function APIDemo({titre, type}) {
  const [method, setMethod] = useState('POST');
  const [yaml, setYaml] = useState(stringify(example[type]))
  const [debouncedYaml] = useDebounce(yaml, 500)
  const [geste, setGeste] = useState('gestes . chauffage . PAC . air-eau')

  const distinctRulesMPR = Object.keys(rules)
                                 .filter((item) => item.startsWith('gestes') && item.endsWith("MPR"))
                                 .map((item) => ({
                                    valeur: item.replace(' . MPR', ''),
                                    titre: rules[item.replace(' . MPR', '')].titre
                                  }))

  const ruleToEvaluate = {
    mprg : `${geste} . MPR . montant`,
    copropriete : 'copropriété . montant',
    cee : 'gestes . isolation . murs extérieurs . CEE . montant',
    "category-mpr" : 'ménage . revenu . classe',
    mpra : 'MPR . accompagnée . montant'
  }

  const montant = useMemo(() => {
    try {
      const json = parse(debouncedYaml)
      const evaluation = engine
        .setSituation(json)
        .evaluate(ruleToEvaluate[type])
      return formatValue(evaluation, { precision: 0 })
    } catch (e) {
      console.log(e)
      return e
    }
  }, [debouncedYaml, type, geste])

  return (
    <>
      <Tabs>
        <TabHeaders role="tablist" aria-label="Démonstrations des API">
          <TabHeader role="presentation">
            <button
              id="tabpanel-post"
              tabIndex={method === 'POST' ? 0 : -1}
              role="tab"
              aria-selected={method === 'POST'}
              aria-controls="tabpanel-post"
              onClick={() => setMethod('POST')}
            >
              Méthode POST
            </button>
          </TabHeader>
          <TabHeader role="presentation">
            <button
              id="tabpanel-get"
              tabIndex={method === 'GET' ? 0 : -1}
              role="tab"
              aria-selected={method === 'GET'}
              aria-controls="tabpanel-get"
              onClick={() => setMethod('GET')}
            >
              Méthode GET
            </button>
          </TabHeader>
        </TabHeaders>
        {method == 'POST' && (
          <TabPanel
            id="tabpanel-post"
            role="tabpanel"
            aria-labelledby="tabpanel-post"
          >
            <APIDemoRest yaml={yaml} method={'post'} />
          </TabPanel>
        )}
        {method == 'GET' && (
          <TabPanel
              id="tabpanel-get"
              role="tabpanel"
              aria-labelledby="tabpanel-get"
          >
            <APIDemoRest yaml={yaml} method={'get'} />
          </TabPanel>
        )}
      </Tabs>
      {type == "mprg" && (
        <div css={`margin-bottom: 1rem`}>
          Geste : {` `}
          <select
            css={`
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
            `}
            onChange={(e) => setGeste(e.target.value)}
            value={geste}
          >
            {distinctRulesMPR.map((item, index) => (
              <option key={index} value={item.valeur} disabled={item.valeur === ""}>
                {item.titre}
              </option>
            ))}
          </select>
        </div>
      )}
      <EvaluationValue>
        <small>{titre}</small>
        <div><strong>{typeof montant === 'string' ? montant : <p>{montant.toString()}</p>}</strong></div>
      </EvaluationValue>
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
