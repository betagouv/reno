'use client'
import aides from '@/app/règles/aides-locales.publicodes'
import { PrimeStyle } from '@/components/Geste'
import { CTA, CTAWrapper, Card, Section } from '@/components/UI'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import { capitalise0 } from '@/components/utils'
import Link from 'next/link'
import Publicodes, { formatValue } from 'publicodes'
import { description } from './description'
import rules from '@/app/règles/rules'

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

const engine = new Publicodes({ ...rules })

export default function () {
  return (
    <div>
      <Section>
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
              const situation = {
                [prefix + place + ' . conditions géo']: 'oui',
                'projet . travaux': 999999,
              }
              const maxSituation = hasCondition
                ? { ...situation, [prefix + conditionName]: 'oui' }
                : situation
              console.log(
                'maxSituation',
                conditionName,
                hasCondition,
                maxSituation,
              )
              const evaluation = engine
                .setSituation(maxSituation)
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
                      <p>
                        <div>{title} : </div>
                        <PrimeStyle>
                          Jusqu'à {formatValue(evaluation)}
                        </PrimeStyle>
                      </p>
                    </li>
                  ))}
                  <CTAWrapper $justify="left" css="margin-bottom: .6rem">
                    <CTA $importance="secondary">
                      <Link href={'/locales/' + place}>
                        Explorer les aides locales {place}
                      </Link>
                    </CTA>
                  </CTAWrapper>
                </Card>
              </li>
            )
          })}
        </ul>
      </Section>
    </div>
  )
}
