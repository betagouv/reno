'use client'

import {
  decodeDottedName,
  encodeDottedName,
  encodeSituation,
} from './publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import rules from '@/app/règles/rules'
import { getTravauxEnvisages, handleCheckTravaux } from './ChoixTravaux'
import Geste, { PrimeBadge } from './Geste'
import styled from 'styled-components'
import FormButtons from '@/app/simulation/FormButtons'
import React from 'react'
import { getRuleName } from './publicodes/utils'
import { useEffect } from 'react'

const localIsMosaic = (dottedName, rule) =>
  dottedName.startsWith('gestes . ') &&
  rule &&
  ['oui', 'non'].includes(rule['par défaut'])

export const gestesMosaicQuestions = Object.entries(rules).filter(
  ([dottedName, rule]) => localIsMosaic(dottedName, rule),
)

export default function ChoixTravauxChauffage({
  situation,
  rules,
  engine,
  answeredQuestions,
  setSearchParams,
}) {
  useEffect(() => {
    push(['trackEvent', 'Simulateur Principal', 'Page', 'Choix chauffage'])
  }, [])
  let travauxEnvisages = getTravauxEnvisages(situation)
  const gestes = gestesMosaicQuestions.filter(
    (k) =>
      travauxEnvisages.filter((t) => {
        return (
          k[0].startsWith(decodeDottedName(t)) &&
          k[0].includes('chauffage') &&
          !k[0].includes('solaire')
        )
      }).length,
  )

  const grouped = gestes.reduce(
    (memo, [q]) => {
      const categoryDottedName = q.split(' . ').slice(0, -1).join(' . ')

      return {
        ...memo,
        [categoryDottedName]: [...(memo[categoryDottedName] || []), q],
      }
    },

    {},
  )

  return (
    <>
      {Object.entries(grouped).map(([category, entries]) => (
        <React.Fragment key={category}>
          <h2>{rules[category].titre}</h2>
          {Object.entries(entries).map(([subCategory, dottedName]) => {
            const encodedDottedName = encodeDottedName(dottedName)
            const checked = travauxEnvisages.includes(encodedDottedName)
            return (
              <div className="fr-fieldset__element" key={subCategory}>
                <div className="fr-custom-checkbox-group fr-checkbox-rich">
                  <input
                    type="checkbox"
                    name={`checkbox-${category}`}
                    id={`checkbox-${encodedDottedName}`}
                    checked={checked}
                    onChange={() =>
                      handleCheckTravaux(dottedName, situation, setSearchParams)
                    }
                  />
                  <label
                    className="fr-label"
                    htmlFor={`checkbox-${encodedDottedName}`}
                  >
                    {rules[dottedName].titre || getRuleName(dottedName)}
                    <span className="fr-hint-text">
                      {rules[dottedName].description}
                    </span>
                  </label>
                </div>
              </div>
            )
          })}
        </React.Fragment>
      ))}
      <FormButtons
        {...{
          currentValue: gestes.filter((geste) =>
            travauxEnvisages.includes(encodeDottedName(geste[0])),
          ).length
            ? true
            : null,
          setSearchParams,
          encodeSituation,
          answeredQuestions,
          questionsToSubmit: ['projet . définition . travaux envisagés'],
          currentQuestion: 'projet . définition . travaux envisagés',
          situation,
          specificBackUrl: setSearchParams({ objectif: undefined }, 'url'),
        }}
      />
    </>
  )
}

const GesteMosaic = styled.div`
  label {
    cursor: pointer;
    margin: 0 0.4rem;
    padding: 0.6rem 0.6rem;
    whitespace: nowrap;
    display: flex;
    justify-content: start;
    align-items: flex-start;
    gap: 0.5rem;
    background: white;
    border: 1px solid #00008f26;
    border-radius: 0.2rem;
    > div {
      width: 100%;
    }
    h3 {
      color: black;
      font-weight: normal;
      font-size: 115%;
    }
    input {
      cursor: pointer;
    }
  }
  h2 {
    font-size: 120%;
  }
  ul {
    list-style-type: none;
    padding: 0;
    li {
      margin-bottom: 0.8rem;
    }
  }
`
