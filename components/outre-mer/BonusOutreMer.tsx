import outreMerImage from '@/public/bonusOutreMer.svg'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Image from 'next/image'
import { formatValue } from 'publicodes'
import { BlocAide } from '../UI'

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

  //TODO ne pas afficher si !nodeValue
  const isEligible = true

  const value = formatValue(evaluation)
  console.log('indigo', evaluation, value)

  const dispositif = engine.evaluate(
    'gestes . outre-mer . dispositif',
  ).nodeValue

  return (
    <BlocAide display="geste">
      <div className="aide-header">
        <OutreMerImage codeRégion="02" nom="Martinique" />
        <div>
          <h4 className="fr-m-0">Prime {dispositif}</h4>
          <Badge noIcon severity={isEligible ? 'success' : 'default'}>
            Prime de {value}
          </Badge>
        </div>
      </div>
    </BlocAide>
  )
}

const OutreMerImage = ({ codeRégion, nom }) => {
  return (
    <div
      css={`
        img {
          width: 3rem;
          height: auto;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 1rem;
      `}
    >
      <img
        src={`/outre-mer/${codeRégion}.svg`}
        width="10"
        height="10"
        alt={`Image représentant la form de ${nom}`}
      />

      <span>{nom}</span>
    </div>
  )
}
