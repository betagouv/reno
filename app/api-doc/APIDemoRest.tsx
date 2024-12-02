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
  const [gestes, setGestes] = useState({
    MPR: 'gestes . chauffage . PAC . air-eau',
    CEE: 'gestes . chauffage . PAC . air-eau',
    globale: 'gestes . isolation . murs extérieurs',
  })
  const [evaluationGlobale, setEvaluationGlobale] = useState(false)

  const ruleToEvaluate = {
    eligibilite: 'eligibilite',
    geste: `${gestes['globale']} . montant`,
    mprg: `${gestes['MPR']} . MPR . montant`,
    cee: `${gestes['CEE']} . CEE . montant`,
    copropriete: 'copropriété . montant',
    'category-mpr': 'ménage . revenu . classe',
    mpra: 'MPR . accompagnée . montant',
    ptz: 'PTZ . montant',
    par: 'PAR . montant',
    denormandie: 'denormandie . montant',
  }

  const typeAide = type == 'mprg' ? 'MPR' : type == 'geste' ? 'globale' : 'CEE'
  const distinctRules = useMemo(() => {
    return Object.keys(rules)
      .filter(
        (item) =>
          item.startsWith('gestes') &&
          ((typeAide !== 'globale' && item.endsWith(typeAide)) ||
            (typeAide === 'globale' &&
              item.endsWith('montant') &&
              !(
                item.includes('MPR') ||
                item.includes('CEE') ||
                item.includes('Coup de pouce')
              ))),
      )
      .map((item) => {
        const rule = item.replace(
          ` . ${typeAide == 'globale' ? 'montant' : typeAide}`,
          '',
        )
        return {
          valeur: rule,
          titre: rules[rule]?.titre || 'erreur',
        }
      })
  }, [typeAide])

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
    getAppUrl() +
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

    const response = await fetch(apiUrl, params)
    setResult(JSON.stringify(await response.json(), null, '\t'))
  }

  const updateYamlForGeste = (yaml, gesteType, newValue) => {
    console.log('gesteType', gesteType)

    const parsedYaml = yaml.split('\n').reduce((acc, line) => {
      const [key, value] = line.split(':')
      if (key && value)
        acc[key.trim()] = value.trim().replace(/^["\s]+|["\s]+$/g, '')
      return acc
    }, {})

    const updatedYaml = omit([gesteType], parsedYaml)
    updatedYaml[newValue] = 'oui'

    return stringify(updatedYaml)
  }
  const changeGeste = (e, typeAide) => {
    setGestes((prev) => ({
      ...prev,
      [typeAide]: e.target.value,
    }))
    setYaml(updateYamlForGeste(yaml, gestes[typeAide], e.target.value))
  }

  const documentationUrl =
    'documentation/' +
    ruleToEvaluate[type]
      .split(' . ')
      // Problème d'encodage sur les tirets (ex: PAC "air-eau" non reconnu)
      .map((e) => e.replace(/-/g, '%E2%80%91'))
      .join('/')

  return (
    <>
      <DocumentationLink href={documentationUrl} target="_blank">
        <Image src={iconDocumentation} alt="Icône documentation" width="24" />
        Documentation
      </DocumentationLink>

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
      {['mprg', 'cee', 'geste'].includes(type) && (
        <div
          css={`
            margin-bottom: 1rem;
          `}
        >
          Geste : {` `}
          <Select
            onChange={(e) => changeGeste(e, typeAide)}
            value={gestes[typeAide]}
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
        <Code>
          <pre>{result ? result : '{}'}</pre>
        </Code>
      </div>
    </>
  )
}
export const DocumentationLink = styled(InternalLink)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  img {
    margin-right: 0.5rem;
  }
`
export const Code = styled.code`
  display: block;
  padding: 1rem;
  background: black;
  color: white;
  min-width: 100%;
  max-height: 15rem;
  overflow: auto;
`
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
