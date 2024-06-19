import { PrimeStyle } from '@/components/Geste'
import { CTA, CTAWrapper, Card } from '@/components/UI'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import { capitalise0 } from '@/components/utils'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import Publicodes from 'publicodes'
import rules from '@/app/règles/rules'
const prefix = 'aides locales . '

const engine = new Publicodes({ ...rules })

export default function PlaceSummary({ place, placeRules }) {
  if (place == 0) return undefined

  const valueRules =
    Array.isArray(placeRules) &&
    placeRules.filter(([dottedName]) => dottedName.endsWith('montant'))

  const levels = valueRules.map(([dottedName, rule]) => [
    dottedName.split(' . ').length,
    dottedName,
  ])

  const evaluations = valueRules.map(([dottedName, rule]) => {
    const conditionName = dottedName.replace(/montant$/, '') + 'conditions',
      hasCondition = placeRules.find(
        ([dottedName2]) => dottedName2 === conditionName,
      )
    const situation = {
      [prefix + place + ' . conditions géo']: 'oui',
      'projet . travaux': 999999,
      'ménage . revenu': 0,
    }
    const maxSituation = hasCondition
      ? { ...situation, [prefix + conditionName]: 'oui' }
      : situation
    console.log('maxSituation', conditionName, hasCondition, maxSituation)
    const evaluation = engine
      .setSituation(maxSituation)
      .evaluate(prefix + dottedName)

    const title =
      rule.titre ||
      getRuleTitle(parentName(dottedName), Object.fromEntries(placeRules))

    return [dottedName, evaluation, title]
  })

  const mainRule = valueRules[0]
  const montant = mainRule && engine.evaluate('aides locales . ' + mainRule[0])

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
      <Card
        css={`
          max-width: 36rem;
        `}
      >
        {evaluations.map(([dottedName, evaluation, title]) => (
          <li key={dottedName}>
            <p>
              <div>{title} : </div>
              <PrimeStyle>Jusqu'à {formatValue(evaluation)}</PrimeStyle>
            </p>
          </li>
        ))}
        <CTAWrapper $justify="left" css="margin-bottom: .6rem">
          <CTA $importance="primary" css="font-size: 100%">
            <Link href={'/locales/' + place}>
              Explorer les aides locales {capitalise0(place)}
            </Link>
          </CTA>
        </CTAWrapper>
      </Card>
    </li>
  )
}
