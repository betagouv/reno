'use client'
import rules from '@/app/règles/rules'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { Main, Section } from '@/components/UI'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import { capitalise0, omit, sortBy } from '@/components/utils'
import { useMemo, useState } from 'react'
const SituationEditor = dynamic(() => import('../SituationEditor'), {
  ssr: false,
})
import aides from '@/app/règles/aides-locales.publicodes'
import Publicodes, { formatValue } from 'publicodes'
import { utils } from 'publicodes'
import IllustratedHeader from '../IllustratedHeader'
import dynamic from 'next/dynamic'
import { dot } from 'node:test/reporters'
const { encodeRuleName } = utils

const aidesEntries = Object.entries(aides)

const getDefaultSituation = (place, engine, placeRules) => {
  const evaluation = engine.evaluate('somme des aides locales')
  const { missingVariables } = evaluation

  const defaultSituationEntries = sortBy(([, score]) => score)(
    Object.entries(missingVariables),
  )
    .map(
      ([dottedName]) =>
        dottedName !== 'simulation . mode' && [
          dottedName,
          engine.evaluate(dottedName).nodeValue,
        ],
    )
    .filter(Boolean)
    // The situation was evaluted from the evaluation of default values
    // the result is not compatible with the object we need to inject in Engine.setSituation
    .map(([dottedName, value]) => {
      if (value === undefined) return
      if ([true, false, 'true', 'false'].includes(value))
        return [
          dottedName,
          { true: 'oui', true: 'oui', false: 'non', false: 'non' }[value],
        ]

      if (dottedName === 'simulation . mode') return

      return [dottedName, value]
    })
    .filter(Boolean)

  const maximiseSituation = [
    ...placeRules
      .filter(([dottedName, rule]) => dottedName.endsWith('conditions géo'))
      .map(([dottedName, rule]) => ['aides locales . ' + dottedName, 'oui']),
    ['projet . travaux', 99999],
    ['ménage . revenu', 0],
  ]

  const defaultMissingVariables = Object.fromEntries([
    ...defaultSituationEntries,
    ...maximiseSituation,
  ])

  //  console.log('situ defaultMissingVariables', defaultMissingVariables)
  return defaultMissingVariables
}

// This component renders in two steps :
// - first extract missing variables, get their default values in an object dottedName: defaultValue
// - get the following missing variables
export default function LocalePlace({ place }) {
  const baseEngine = useMemo(() => {
    const toSum = aidesEntries
        .filter(
          ([dottedName, value]) =>
            dottedName &&
            dottedName.startsWith(place) &&
            dottedName.endsWith(' . montant'),
        )
        .map(([dottedName, value]) => 'aides locales . ' + dottedName),
      sum = { somme: toSum }
    const rulesWithoutDefault = Object.fromEntries(
      Object.entries(rules).map(([dottedName, rule]) => [
        dottedName,
        rule ? omit(['par défaut'], rule) : rule,
      ]),
    )
    return new Publicodes({
      ...rulesWithoutDefault,
      'somme des aides locales': sum,
    })
  }, [place])

  const placeRules = aidesEntries.filter(([dottedName, rule]) =>
    dottedName.startsWith(place),
  )

  const placeTitle = getRuleTitle(place, Object.fromEntries(placeRules)),
    rule = Object.fromEntries(placeRules)[place] || {},
    imageTitle = rule['image wikidata'] || placeTitle

  //const defaultSituation = getDefaultSituation(place, baseEngine, placeRules)
  const evaluation = baseEngine.evaluate('somme des aides locales')
  const { missingVariables } = evaluation

  return console.log(missingVariables)

  return (
    <div css={``}>
      <Section>
        <IllustratedHeader placeTitle={placeTitle} imageTitle={imageTitle} />
        <p>
          Découvrez ci-dessous les aides locales {capitalise0(place)}. Vous
          pouvez changer la situation de votre ménage pour voir l'évolution du
          montant et de l'éligibilité des aides.
        </p>
      </Section>
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
            left: 6rem;
          `}
        >
          <h2>Votre situation</h2>
          <SituationEditor {...{ situation, setUserSituation }} />
        </div>
        <Section
          css={`
            margin-top: 2rem;
          `}
        >
          <ul
            css={`
              list-style-type: none;
            `}
          >
            {sortBy(
              ([dottedName]) =>
                dottedName == place || !dottedName.endsWith('montant'),
            )(placeRules).map(([dottedName, rule]) => {
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
                      id={encodeRuleName(dottedName)}
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
                            padding: 0 0.4rem;
                            ${isMontant && `background: var(--lighterColor)`}
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
                      <div
                        css={`
                          padding: 0.6rem 1.2rem;
                        `}
                      >
                        {rule}
                      </div>
                    ) : (
                      <FriendlyObjectViewer
                        {...{
                          data: omit(['titre'], rule),
                          context: {
                            dottedName,
                            rules: Object.fromEntries(placeRules),
                          },
                          options: {
                            keyStyle: `
									color: #41438a
									`,
                            computePathname: (encodedDottedName: string) =>
                              `/locales/${place}/#${encodedDottedName}`,
                          },
                        }}
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </Section>
      </div>
    </div>
  )
}
