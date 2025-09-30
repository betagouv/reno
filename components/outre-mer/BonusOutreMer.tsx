import Badge from '@codegouvfr/react-dsfr/Badge'
import { formatValue } from 'publicodes'
import { BlocAide } from '../UI'
import outreMerPublicodes from '@/app/règles/outre-mer.publicodes'

export default function BonusOutreMer({
  engine,
  dottedName,
  rules,
  situation,
}) {
  const bonusDottedName = dottedName + ' . bonus outre-mer',
    bonusRule = rules[bonusDottedName]

  if (bonusRule === undefined) return

  const hasSurface = situation[dottedName + ' . MPR . surface']

  const key = hasSurface ? 'montant' : 'barème'
  const evaluation = engine
    .setSituation(situation)
    .evaluate(bonusDottedName + ' . ' + key)

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
        <OutreMerImage
          codeRégion={situation['logement . code région']?.replace(/"/g, '')}
        />
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

const OutreMerImage = ({ codeRégion }) => {
  if (!codeRégion) return 'Région non renseignée'

  const region = Object.entries(outreMerPublicodes).find(([key, value]) => {
    const test = `'${codeRégion}'`
    return typeof value === 'string' && value.endsWith(test)
  })

  if (!region) return 'Région hors DROM'

  const nom = region[0].split('outre-mer . ')[1]

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
