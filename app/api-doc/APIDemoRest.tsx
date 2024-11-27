'use client'
import { useMemo, useState } from 'react'
import { parse, stringify } from 'yaml'
import rules from '@/app/règles/rules'
import styled from 'styled-components'
import example from '@/app/api-doc/api-example.yaml'
import getAppUrl from '@/components/getAppUrl'
import {
  encodeDottedName,
  encodeSituation,
} from '@/components/publicodes/situationUtils'
import { CTA, InternalLink, MiseEnAvant } from '@/components/UI'
import { omit } from '@/components/utils'
import iconDocumentation from '@/public/documentation.svg'
import Image from 'next/image'
import { Select } from '@/components/InputUI'

export default function APIDemoRest({ type, method = 'POST' }) {
  const [result, setResult] = useState('')
  const [yaml, setYaml] = useState(stringify(example[type]))
  const [geste, setGeste] = useState('gestes . chauffage . PAC . air-eau')
  const [gesteCee, setGesteCee] = useState(
    'gestes . isolation . murs extérieurs',
  )
  const [evaluationGlobale, setEvaluationGlobale] = useState(false)

  const ruleToEvaluate = {
    mprg: `${geste} . MPR . montant`,
    copropriete: 'copropriété . montant',
    cee: `${gesteCee} . CEE . montant`,
    'category-mpr': 'ménage . revenu . classe',
    mpra: 'MPR . accompagnée . montant',
    ptz: 'PTZ . montant',
    par: 'PAR . montant',
    denormandie: 'denormandie . montant',
    eligibilite: 'eligibilite',
  }

  const typeGeste = type == 'mprg' ? 'MPR' : 'CEE'
  const distinctRules = Object.keys(rules)
    .filter((item) => item.startsWith('gestes') && item.endsWith(typeGeste))
    .map((item) => ({
      valeur: item.replace(` . ${typeGeste}`, ''),
      titre: rules[item.replace(` . ${typeGeste}`, '')].titre,
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

  const fields = { fields: encodeDottedName(ruleToEvaluate[type]) }
  const searchParams = encodeSituation({ ...situation, ...fields })
  const apiUrl =
    domain +
    '/api/v1/?' +
    new URLSearchParams(method === 'GET' ? searchParams : fields).toString() +
    (evaluationGlobale ? ',evaluation' : '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    let params = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (method === 'POST') {
      params['body'] = JSON.stringify(situation)
    }
    console.log('apiUrl', apiUrl)
    const response = await fetch(apiUrl, params)
    setResult(JSON.stringify(await response.json(), null, '\t'))
  }

  const changeGeste = (e) => {
    if (typeGeste == 'MPR') {
      setGeste(e.target.value)
    } else {
      setGesteCee(e.target.value)
    }

    let newYaml = Object.values(
      yaml.split('\n').map((line) => line.split(':')),
    ).reduce((acc, [key, value]) => {
      if (!value) {
        return acc
      }
      acc[key.trim()] = value.trim().replace(/^["\s]+|["\s]+$/g, '')
      return acc
    }, {})

    newYaml = omit([typeGeste == 'MPR' ? geste : gesteCee], newYaml)
    newYaml[e.target.value] = 'oui'

    setYaml(stringify(newYaml))
  }

  const documentationPath =
    'documentation/' +
    ruleToEvaluate[type]
      .split(' . ')
      // Problème d'encodage sur les tirets (ex: PAC "air-eau" non reconnu)
      .map((e) => e.replace(/-/g, '%E2%80%91'))
      .join('/')
  return (
    <>
      <InternalLink
        href={documentationPath}
        target="_blank"
        css={`
          display: inline-flex;
          align-items: center;
          margin-bottom: 1rem;
        `}
      >
        <Image
          src={iconDocumentation}
          alt="Icône documentation"
          width="24"
          css={`
            margin-right: 0.5rem;
          `}
        />
        Documentation
      </InternalLink>

      <div
        css={`
          word-wrap: break-word;
          margin-bottom: 1rem;
        `}
      >
        <strong>URL: </strong>
        {method.toUpperCase() + ' ' + apiUrl}
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        `}
      >
        <input
          css={`
            margin-right: 1rem;
          `}
          type="checkbox"
          id="evaluationGlobale"
          onClick={() => setEvaluationGlobale(!evaluationGlobale)}
        />
        <label htmlFor="evaluationGlobale">
          Retourner l'évaluation globale
        </label>
      </div>
      {method === 'GET' && (
        <MiseEnAvant>
          Il faut sérialiser les paramètres passés via l'url en utilisant la
          fonction{' '}
          <a href="https://github.com/betagouv/reno/blob/master/components/publicodes/situationUtils.ts#L55">
            encodeSituation
          </a>
          .
        </MiseEnAvant>
      )}
      {['mprg', 'cee'].includes(type) && (
        <div
          css={`
            margin-bottom: 1rem;
          `}
        >
          Geste : {` `}
          <Select
            onChange={(e) => changeGeste(e)}
            value={typeGeste == 'MPR' ? geste : gesteCee}
          >
            {distinctRules.map((item, index) => (
              <option
                key={index}
                value={item.valeur}
                disabled={item.valeur === ''}
              >
                {item.titre}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div
        css={`
          display: flex;
          align-items: end;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 1rem;
        `}
      >
        <div
          css={`
            width: 80%;
          `}
        >
          <strong
            css={`
              display: block;
            `}
          >
            Paramètres:
          </strong>
          <TextArea
            css={`
              width: 100%;
            `}
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
          />
        </div>

        <CTA
          onClick={(e) => handleSubmit(e, method)}
          css={`
            padding: 0.8rem 1.2rem;
            cursor: pointer;
            height: fit-content;
          `}
        >
          Exécuter
        </CTA>
      </div>
      <div>
        <strong
          css={`
            display: block;
          `}
        >
          Résultat:
        </strong>
        <code
          css={`
            display: block;
            padding: 1rem;
            background: black;
            color: white;
            min-width: 100%;
            max-height: 15rem;
            overflow: auto;
          `}
        >
          <pre>{result ? result : '{}'}</pre>
        </code>
      </div>
    </>
  )
}

export const TextArea = styled.textarea`
  padding: 0.6rem;
  font-size: 100%;
  height: 11rem;
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
