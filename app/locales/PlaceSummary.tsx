import rules from '@/app/règles/rules'
import { CTA, CTAWrapper, Card, PrimeStyle } from '@/components/UI'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import { capitalise0 } from '@/components/utils'
import Link from 'next/link'
import Publicodes, { formatValue } from 'publicodes'
import IllustratedHeader from './IllustratedHeader'
const prefix = 'aides locales . '

const engine = new Publicodes({ ...rules })

export default function PlaceSummary({ place, placeRules }) {
  if (place == 0) return undefined

  const placeTitle = getRuleTitle(place, Object.fromEntries(placeRules)),
    rule = Object.fromEntries(placeRules)[place] || {},
    imageTitle = rule['image wikidata'] || placeTitle,
    imageLink = rule['image']
  const valueRules =
    Array.isArray(placeRules) &&
    placeRules.filter(
      ([dottedName]) =>
        dottedName.endsWith('montant') && dottedName.split(' . ').length > 2,
    )

  // idea, not used yet
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

  const href = '/locales/' + place
  return (
    <li
      key={place}
      css={`
        margin-bottom: 2rem;
      `}
    >
      {' '}
      <Link href={href}>
        <IllustratedHeader {...{
          imageTitle, 
          placeTitle, 
          imageLink
         }} 
        />
      </Link>
      <Card
        css={`
          max-width: 36rem;
        `}
      >
        <ul
          css={`
            padding-left: 0.6rem;
            li {
              margin: 0.6rem 0;
              div:first-child {
                margin-bottom: 0.4rem;
              }
            }
          `}
        >
          {evaluations.map(([dottedName, evaluation, title]) => (
            <li key={dottedName}>
              <div>{title} </div>
              <PrimeStyle>Jusqu'à {formatValue(evaluation)}</PrimeStyle>
            </li>
          ))}
        </ul>
        <CTAWrapper $justify="left" css="margin-bottom: .6rem">
          <CTA $importance="primary" css="font-size: 100%">
            <Link href={href}>Explorer les aides {capitalise0(place)}</Link>
          </CTA>
        </CTAWrapper>
      </Card>
    </li>
  )
}
