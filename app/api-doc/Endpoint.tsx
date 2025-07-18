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
import { MiseEnAvant } from '@/components/UI'
import { omit } from '@/components/utils'
import iconDocumentation from '@/public/documentation.svg'
import Image from 'next/image'
import { No, Yes } from '@/components/ResultUI'
import { Loader } from '@/components/UI'
import Button from '@codegouvfr/react-dsfr/Button'
import Select from '@codegouvfr/react-dsfr/Select'
import Input from '@codegouvfr/react-dsfr/Input'

export default function Endpoint({ type }) {
  const [method, setMethod] = useState('POST')
  const [result, setResult] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const [yaml, setYaml] = useState(stringify(example[type]))
  const [geste, setGeste] = useState('gestes . chauffage . PAC . air-eau')
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
    new URLSearchParams(method === 'GET' ? searchParams : fields).toString()

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
        Url : {apiUrl}
        <Select
          label="Méthode :"
          nativeSelectProps={{
            onChange: (e) => setMethod(e.target.value),
            value: method,
          }}
        >
          <option value="POST">POST</option>
          <option value="GET">GET</option>
        </Select>
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        `}
      >
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
        <div className="fr-callout">
          Il faut sérialiser les paramètres passés via l'url en utilisant la
          fonction{' '}
          <a
            rel="noopener external"
            className="fr-link"
            href="https://github.com/betagouv/reno/blob/master/components/publicodes/situationUtils.ts#L55"
          >
            encodeSituation
          </a>
          .
        </div>
      )}
      {['MPR', 'CEE', 'geste'].includes(type) && (
        <Select
          label="Geste :"
          nativeSelectProps={{
            onChange: (e) => changeGeste(e.target.value),
            value: geste,
          }}
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
          <div className="fr-input-group" id="input-group">
            <label className="fr-label" htmlFor="yaml">
              Paramètres :
              <span className="fr-hint-text">
                <a href="#parametres" className="fr-link">
                  Voir la liste des paramètres
                </a>
              </span>
            </label>
            <textarea
              rows={12}
              className="fr-input"
              aria-describedby="yaml-messages"
              id="yaml"
              value={yaml}
              onChange={(e) => setYaml(e.target.value)}
            />
            <div
              className="fr-messages-group"
              id="yaml-messages"
              aria-live="polite"
            ></div>
          </div>
        </div>
        <Button onClick={(e) => handleSubmit(e, method)}>Exécuter</Button>
      </div>

      {type == 'eligibilite' && result && (
        <div className="fr-callout fr-callout--orange-terre-battue fr-my-5v">
          <h4>
            La propriété <em>"status"</em> est primordiale.
          </h4>
          Trois valeurs sont possibles:
          <ul>
            <li>
              <strong>true</strong> : La situation soumise{' '}
              <strong>remplit les critères d'éligibilité</strong> pour ce
              dispositif.
            </li>
            <li>
              <strong>false</strong> : La situation soumise{' '}
              <strong>ne remplit pas les critères d'éligibilité</strong> pour ce
              dispositif
            </li>
            <li>
              <strong>null</strong> : Il manque des informations (probablement
              les variables dans la propriété <em>missingVariables</em>) pour
              pouvoir déterminer l'éligibilité
            </li>
          </ul>
        </div>
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
          {showLoader ? (
            <Loader></Loader>
          ) : (
            <pre>{result ? result : '{}'}</pre>
          )}{' '}
        </Code>
      </div>
    </>
  )
}
export const DocumentationLink = styled.a`
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

export const EvaluationValue = styled.div`
  background: var(--color);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  small {
    margin-bottom: 0.4rem;
  }
`
