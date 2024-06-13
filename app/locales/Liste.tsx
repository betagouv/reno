'use client'
import aides from '@/app/règles/aides-locales.yaml'
import rules from '@/app/règles/rules'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { Section } from '@/components/UI'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import { capitalise0, omit, sortBy } from '@/components/utils'
import Publicodes, { formatValue } from 'publicodes'
import { useMemo, useState } from 'react'
import SituationEditor from './SituationEditor'
import Link from 'next/link'
import { description } from './description'

const aidesEntries = Object.entries(aides)

const byPlace = aidesEntries.reduce(
  (memo, next) => {
    const dottedName = next[0]
    if (dottedName === '' || dottedName == '0') return memo

    const place = dottedName.split(' . ')[0]

    return { ...memo, [place]: [...(memo[place] || []), next] }
  },
  [{}],
)

const toSum = aidesEntries
    .filter(
      ([dottedName, value]) => dottedName && dottedName.endsWith(' . montant'),
    )
    .map(([dottedName, value]) => 'aides locales . ' + dottedName),
  sum = { somme: toSum }

const baseEngine = new Publicodes({ ...rules, 'somme des aides locales': sum })

const evaluation = baseEngine.evaluate('somme des aides locales')
const { missingVariables } = evaluation

const defaultSituationEntries = sortBy(([, score]) => score)(
  Object.entries(missingVariables),
)
  .map(
    ([dottedName]) =>
      dottedName !== 'simulation . mode' && [
        dottedName,
        baseEngine.evaluate(dottedName).nodeValue,
      ],
  )
  .filter(Boolean)

export default function () {
  const [situationEntries, setSituationEntries] = useState(
    defaultSituationEntries,
  )

  const engine = useMemo(() => {
    try {
      const situation = Object.fromEntries(
        [
          // The situation was evaluted from the evaluation of default values
          // the result is not compatible with the object we need to inject in Engine.setSituation
          ...situationEntries.map(([dottedName, value]) => {
            if ([true, false, 'true', 'false'].includes(value))
              return [
                dottedName,
                { true: 'oui', true: 'oui', false: 'non', false: 'non' }[value],
              ]

            if (dottedName === 'simulation . mode') return

            return [dottedName, value]
          }),
          ...aidesEntries
            .filter(([dottedName, rule]) =>
              dottedName.endsWith('conditions géo'),
            )
            .map(([dottedName, rule]) => [
              'aides locales . ' + dottedName,
              'oui',
            ]),
        ].filter(Boolean),
      )
      console.log(
        'situation',
        situation,
        Object.fromEntries(defaultSituationEntries),
      )

      return baseEngine.setSituation(situation)
    } catch (e) {
      return baseEngine
    }
  }, [situationEntries, baseEngine])

  return (
    <div
      css={`
        display: flex;
        overflow: scroll;
      `}
    >
      <div
        css={`
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          left: 2rem;
        `}
      >
        <h2>Situation</h2>
        <SituationEditor {...{ situationEntries, setSituationEntries }} />
      </div>

      <Section
        css={`
          margin-left: 28rem;
        `}
      >
        <h1>Les aides locales à la rénovation en France</h1>
        <p>{description}</p>
        <p>
          Sont listées ici les aides financières soutenues par une source
          officielle. Cela peut être une page Web, un PDF sur le site d'une
          collectivité, ou une page ANIL dont la date de vérification est
          récente. Il est de la responsabilité des collectivités de supprimer
          leurs références à des aides obsolètes.
        </p>
        <p>
          💡 Cette liste n'est pas complète : si vous avez des informations
          précises sur une aide locale, <Link href="/faq">contactez-nous</Link>{' '}
          !
        </p>
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
              mainRule && engine.evaluate('aides locales . ' + mainRule[0])

            if (!montant) return null

            const value = formatValue(montant)

            return (
              <li key={place} css={``}>
                <h2
                  css={`
                    position: sticky;
                    top: 0px;
                  `}
                >
                  {capitalise0(place)}
                </h2>

                <ul
                  css={`
                    list-style-type: none;
                  `}
                >
                  {sortBy(
                    ([dottedName]) =>
                      dottedName == place || !dottedName.endsWith('montant'),
                  )(rules).map(([dottedName, rule]) => {
                    if (rule == null) return

                    const evaluation = engine.evaluate(
                      'aides locales . ' + dottedName,
                    )
                    const value = formatValue(evaluation)

                    const isMontant = dottedName.endsWith('montant')

                    return (
                      <li
                        key={dottedName}
                        css={`
                          margin: 0.6rem 0;
                        `}
                      >
                        {dottedName !== place && (
                          <div
                            css={`
                              display: flex;
                              justify-content: space-between;
                            `}
                          >
                            <span
                              css={`
                                display: flex;
                                flex-direction: column;
                              `}
                            >
                              <small>
                                {parentName(dottedName).split(place + ' . ')[1]}
                              </small>
                              <h3
                                css={`
                                  font-size: 100%;
                                  margin: 0;
                                  width: fit-content;
                                  ${isMontant && `background: yellow`}
                                `}
                              >
                                {getRuleTitle(dottedName, aides)}
                              </h3>
                            </span>
                            <span>{value}</span>
                          </div>
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
                          {typeof rule === 'string' ? (
                            <div>{rule}</div>
                          ) : (
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
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </Section>
    </div>
  )
}
