'use client'
import aides from '@/app/règles/aides-locales.yaml'
import rules from '@/app/règles/rules'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { getRuleTitle } from '@/components/publicodes/utils'
import { capitalise0, omit, sortBy } from '@/components/utils'
import Publicodes, { formatValue } from 'publicodes'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { stringify } from 'yaml'
import { TextArea } from '../api-doc/APIDemo'
import { defaults } from 'marked'
import SituationEditor from './SituationEditor'

const entries = Object.entries(aides)

const byPlace = entries.reduce(
  (memo, next) => {
    const dottedName = next[0]
    if (dottedName === '' || dottedName == '0') return memo

    const place = dottedName.split(' . ')[0]

    return { ...memo, [place]: [...(memo[place] || []), next] }
  },
  [{}],
)

const toSum = entries
    .filter(
      ([dottedName, value]) => dottedName && dottedName.endsWith(' . montant'),
    )
    .map(([dottedName, value]) => 'aides locales . ' + dottedName),
  sum = { somme: toSum }

const engine = new Publicodes({ ...rules, 'somme des aides locales': sum })

export default function () {
  const evaluation = engine.evaluate('somme des aides locales')
  const { missingVariables } = evaluation

  const defaultSituationEntries = sortBy(([, score]) => score)(
    Object.entries(missingVariables),
  ).map(([dottedName]) => [dottedName, engine.evaluate(dottedName).nodeValue])

  const [situationEntries, setSituationEntries] = useState(
    defaultSituationEntries,
  )

  const situation = Object.fromEntries(
    situationEntries
      .map(([dottedName, value]) => {
        if ([true, false].includes(value))
          return [dottedName, { true: 'oui', false: 'non' }[value]]

        if (dottedName === 'simulation . mode') return

        return [dottedName, value]
      })
      .filter(Boolean),
  )

  console.log(
    'situation',
    situation,
    Object.fromEntries(defaultSituationEntries),
  )

  return (
    <div>
      <SituationEditor {...{ situationEntries, setSituationEntries }} />
      <ul
        css={`
          list-style-type: none;
        `}
      >
        {Object.entries(byPlace).map(([place, rules]) => {
          if (place == 0) return undefined

          const mainRule =
            Array.isArray(rules) &&
            rules.find(([dottedName]) => dottedName.endsWith('montant'))

          const montant =
            mainRule &&
            engine
              .setSituation(situation)
              .evaluate('aides locales . ' + mainRule[0])

          if (!montant) return null

          console.log('montant2', montant)

          const value = formatValue(montant)

          return (
            <li key={place} css={``}>
              <h2>{capitalise0(place)}</h2>

              {value}

              <ul
                css={`
                  list-style-type: none;
                `}
              >
                {rules.map(([dottedName, rule]) => {
                  if (rule == null) return
                  if (typeof rule === 'string') return rule
                  return (
                    <li
                      key={dottedName}
                      css={`
                        margin: 0.6rem 0;
                      `}
                    >
                      {dottedName !== place && (
                        <div>{getRuleTitle(dottedName, aides)}</div>
                      )}
                      <div
                        css={`
                          > div {
                            border: 1px solid #aaa;
                            > ul {
                              padding-left: 0.6rem;
                              margin: 0.6rem 0;
                            }
                          }
                        `}
                      >
                        <FriendlyObjectViewer
                          {...{
                            data: omit(['titre'], rule),
                            options: {
                              keyStyle: `
									color: #41438a
									`,
                            },
                          }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
