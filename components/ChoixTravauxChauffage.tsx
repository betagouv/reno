'use client'

import {
  decodeDottedName,
  encodeDottedName,
  encodeSituation,
} from './publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import rules from '@/app/règles/rules'
import { getTravauxEnvisages, handleCheckTravaux } from './ChoixTravaux'
import Geste from './Geste'
import styled from 'styled-components'
import FormButtons from '@/app/simulation/FormButtons'

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
  push(['trackEvent', 'Simulateur Principal', 'Page', 'Choix chauffage'])
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
      <GesteMosaic>
        {Object.entries(grouped).map(([category, entries]) => (
          <div key={category}>
            <h2>{rules[category].titre}</h2>
            <ul>
              {Object.entries(entries).map(([subCategory, dottedName]) => {
                const checked = travauxEnvisages.includes(
                  encodeDottedName(dottedName),
                )
                return (
                  <li key={subCategory}>
                    <label
                      css={`
                        ${checked && `border: 2px solid var(--color);`}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          handleCheckTravaux(
                            dottedName,
                            situation,
                            setSearchParams,
                          )
                        }
                      />
                      <Geste
                        {...{
                          rules,
                          dottedName,
                          engine,
                          situation,
                          expanded: false,
                        }}
                      />
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </GesteMosaic>
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
