import { formatValue } from 'publicodes'

export default function BonusOutreMer({
  engine,
  dottedName,
  rules,
  situation,
}) {
  const bonusDottedName = dottedName + ' . bonus outre-mer',
    bonusRule = rules[bonusDottedName]

  if (bonusRule === undefined) return

  const evaluation = engine
    .setSituation(situation)
    .evaluate(bonusDottedName + ' . montant')

  console.log('indigo', evaluation)

  return formatValue(evaluation)

  return 'Bonus outre-mer'
}
