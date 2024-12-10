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
import Publicodes from 'publicodes'
import { CTA, InternalLink, ExternalLink, MiseEnAvant } from '@/components/UI'
import { omit } from '@/components/utils'
import iconDocumentation from '@/public/documentation.svg'
import Image from 'next/image'
import { Select } from '@/components/InputUI'
import { No, Yes } from '@/components/ResultUI'
import { Loader } from '@/components/UI'

export default function Endpoint({ type }) {
  const [method, setMethod] = useState('POST')
  const [result, setResult] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const [yaml, setYaml] = useState(stringify(example[type]))
  const [geste, setGeste] = useState('gestes . chauffage . PAC . air-eau')
  const [evaluationGlobale, setEvaluationGlobale] = useState(false)
  const engine = new Publicodes(rules)

  const ruleToEvaluate = {
    eligibilite: 'eligibilite',
    geste: `${geste} . montant`,
    MPR: `${geste} . MPR . montant`,
    CEE: `${geste} . CEE . montant`,
    copropriete: 'copropriété . montant',
    'category-mpr': 'ménage . revenu . classe',
    mpra: 'MPR . accompagnée . montant',
    ptz: 'PTZ . montant',
    par: 'PAR . montant',
    denormandie: 'denormandie . montant',
    'taxe fonciere': 'taxe foncière . montant',
  }

  const distinctRules = useMemo(() => {
    return Object.keys(rules)
      .filter(
        (item) =>
          item.startsWith('gestes') &&
          ((type !== 'geste' && item.endsWith(type)) ||
            (type === 'geste' &&
              item !== 'gestes . montant' &&
              item.endsWith('montant') &&
              !(
                item.includes('MPR') ||
                item.includes('CEE') ||
                item.includes('Coup de pouce')
              ))),
      )
      .map((item) => {
        const rule = item.replace(` . ${type}`, '').replace(' . montant', '')
        return {
          valeur: rule,
          titre: rules[rule].titre,
        }
      })
  }, [type])

  const situation = useMemo(() => {
    try {
      return parse(yaml)
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
    setShowLoader(true)
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
    setShowLoader(false)
    setResult(JSON.stringify(await response.json(), null, '\t'))
  }

  const updateYamlForGeste = (yaml, newGeste) => {
    const parsedYaml = yaml.split('\n').reduce((acc, line) => {
      const [key, value] = line.split(':')
      if (key && value)
        acc[key.trim()] = value.trim().replace(/^["\s]+|["\s]+$/g, '')
      return acc
    }, {})

    const updatedYaml = omit([geste], parsedYaml)
    updatedYaml[newGeste] = 'oui'
    const missingVariable = engine
      .setSituation(updatedYaml)
      .evaluate(ruleToEvaluate[type].replace(geste, newGeste)).missingVariables
    Object.keys(missingVariable).map((missingVariable) => {
      return (updatedYaml[missingVariable] =
        engine.evaluate(missingVariable).nodeValue)
    })

    return stringify(updatedYaml)
  }

  const changeGeste = (e) => {
    const newGeste = e.target.value
    const updatedYaml = updateYamlForGeste(yaml, newGeste)
    setGeste(newGeste)
    setYaml(updatedYaml)
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
      <div
        css={`
          word-wrap: break-word;
          margin-bottom: 1rem;
        `}
      >
        <strong>URL: </strong>
        <Select onChange={(e) => setMethod(e.target.value)} value={method}>
          <option value="POST">POST</option>
          <option value="GET">GET</option>
        </Select>
        {' ' + apiUrl}
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <input
            css={`
              margin-right: 0.5rem;
            `}
            type="checkbox"
            id="evaluationGlobale"
            onClick={() => setEvaluationGlobale(!evaluationGlobale)}
          />
          <label htmlFor="evaluationGlobale">
            Retourner l'évaluation globale
          </label>
        </div>
        {type != 'eligibilite' && (
          <DocumentationLink href={documentationUrl} target="_blank">
            <Image
              src={iconDocumentation}
              alt="Icône documentation"
              width="24"
            />
            Documentation
          </DocumentationLink>
        )}
      </div>
      {method === 'GET' && (
        <MiseEnAvant>
          Il faut sérialiser les paramètres passés via l'url en utilisant la
          fonction{' '}
          <ExternalLink href="https://github.com/betagouv/reno/blob/master/components/publicodes/situationUtils.ts#L55">
            encodeSituation
          </ExternalLink>
          .
        </MiseEnAvant>
      )}
      {['MPR', 'CEE', 'geste'].includes(type) && (
        <div
          css={`
            margin-bottom: 1rem;
          `}
        >
          Geste : {` `}
          <Select onChange={(e) => changeGeste(e)} value={geste}>
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
      <InternalLink
        href="#parametres"
        css={`
          display: inline-block;
          margin-bottom: 1rem;
        `}
      >
        Voir la liste des paramètres
      </InternalLink>
      {type == 'eligibilite' && result && (
        <MiseEnAvant $type="warning" $noradius={true}>
          <h4
            css={`
              margin: 0 0 1rem;
            `}
          >
            La propriété <strong>"status"</strong> est primordiale.
          </h4>
          Trois valeurs sont possibles:
          <ul
            css={`
              li {
                line-height: 1.6rem;
              }
            `}
          >
            <li>
              <strong>true</strong> : La situation soumise{' '}
              <Yes>remplit les critères d'éligibilité</Yes> pour ce dispositif.
            </li>
            <li>
              <strong>false</strong> : La situation soumise{' '}
              <No>ne remplit pas les critères d'éligibilité</No> pour ce
              dispositif
            </li>
            <li>
              <strong>null</strong> : Il manque des informations (probablement
              les variables dans la propriété <em>missingVariables</em>) pour
              pouvoir déterminer l'éligibilité
            </li>
          </ul>
        </MiseEnAvant>
      )}
      <div>
        <strong
          css={`
            display: block;
          `}
        >
          Résultat:
        </strong>
        <Code>
          {showLoader ? <Loader></Loader> : <pre>{result ? result : '{}'}</pre>}{' '}
        </Code>
      </div>
    </>
  )
}
export const DocumentationLink = styled(InternalLink)`
  display: inline-flex;
  align-items: center;
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
