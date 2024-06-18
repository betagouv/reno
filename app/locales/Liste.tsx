'use client'
import aides from '@/app/règles/aides-locales.publicodes'
import rules from '@/app/règles/rules'
import { Card, Section } from '@/components/UI'
import { capitalise0, sortBy } from '@/components/utils'
import Link from 'next/link'
import Publicodes, { formatValue } from 'publicodes'
import { useMemo, useState } from 'react'
import SituationEditor from './SituationEditor'
import { description } from './description'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'

const aidesEntries = Object.entries(aides)

const prefix = 'aides locales . '

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

// TODO je crois que l'itinialisation ici fait peut-être louper des missing variables qui apparaissent après
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

  console.log('plop', missingVariables)

  const [engine, situation] = useMemo(() => {
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

      const engine = baseEngine.setSituation(situation)

      console.log('Success loading situation in Publicodes engine ')
      return [engine, situation]
    } catch (e) {
      console.error('Error loading situation in Publicodes engine : ', e)
      return [baseEngine, situation]
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
          {Object.entries(byPlace).map(([place, placeRules]) => {
            if (place == 0) return undefined

            const valueRules =
              Array.isArray(placeRules) &&
              placeRules.filter(([dottedName]) =>
                dottedName.endsWith('montant'),
              )

            const levels = valueRules.map(([dottedName, rule]) => [
              dottedName.split(' . ').length,
              dottedName,
            ])

            const evaluations = valueRules.map(([dottedName, rule]) => {
              const conditionName =
                  dottedName.replace(/montant$/, '') + 'conditions',
                hasCondition = placeRules.find(
                  ([dottedName2]) => dottedName2 === conditionName,
                )
              const okSituation = hasCondition
                ? {
                    ...situation,
                    //[place + ' . conditions géo']: 'oui',
                    [prefix + conditionName]: 'oui',
                  }
                : situation
              console.log(
                'okSituation',
                conditionName,
                hasCondition,
                okSituation,
              )
              const evaluation = engine
                .setSituation(okSituation)
                .evaluate(prefix + dottedName)

              const title =
                rule.titre ||
                getRuleTitle(
                  parentName(dottedName),
                  Object.fromEntries(placeRules),
                )

              return [dottedName, evaluation, title]
            })

            const mainRule = valueRules[0]
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
                <Card>
                  {evaluations.map(([dottedName, evaluation, title]) => (
                    <li key={dottedName}>
                      <div>
                        {title} : {formatValue(evaluation)}
                      </div>

                      <Link href={'/locales/' + place}>
                        Explorer l'aide locale {place}
                      </Link>
                    </li>
                  ))}
                </Card>
              </li>
            )
          })}
        </ul>
      </Section>
    </div>
  )
}
