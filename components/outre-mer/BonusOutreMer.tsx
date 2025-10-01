import Badge from '@codegouvfr/react-dsfr/Badge'
import { formatValue } from 'publicodes'
import { BlocAide } from '../UI'
import outreMerPublicodes from '@/app/règles/outre-mer.publicodes'
import getNextQuestions from '../publicodes/getNextQuestions'
import GesteQuestion from '../GesteQuestion'
import { encodeSituation } from '../publicodes/situationUtils'
import { useEffect } from 'react'

/*
 * Ce composant ne devrait presque pas exister. Les différentes couches qui font les aides par geste devraient être gérées de façon générique avec seul l'icône et d'autres métadonnées ajoutées en personnalisation depuis des attributs publicodes.
 *
 * C'est une copie des autres composants, un peu moins complexe car TODO dans un premier temps intégrée seulement dans le simulateur principal.
 *
 * */

export default function BonusOutreMer({
  engine,
  dottedName,
  rules,
  situation,
  answeredQuestions,
  setSearchParams,
}) {
  const bonusDottedName = dottedName + ' . bonus outre-mer',
    bonusRule = rules[bonusDottedName]

  /* TODO tiré de BlocAideCEE, mais non documenté, ça sert à quoi ?
  const encodedSituation = encodeSituation(
    {
      ...situation,
    },
    false,
    answeredQuestions,
  )

  useEffect(() => {
    setSearchParams(encodedSituation, 'push', false)
  }, [encodedSituation, setSearchParams])
  */

  if (bonusRule === undefined) return

  const hasSurface = situation[dottedName + ' . MPR . surface']

  const key = hasSurface ? 'montant' : 'barème'
  const evaluation = engine
    .setSituation(situation)
    .evaluate(bonusDottedName + ' . ' + key)

  //TODO ne pas afficher si !nodeValue
  const isEligible = true

  const value = formatValue(evaluation)

  const dispositif = engine.evaluate(
    'gestes . outre-mer . dispositif',
  ).nodeValue

  const questions = getNextQuestions(
    engine.setSituation(situation).evaluate(bonusDottedName + ' . barème'),
  )

  const relevantQuestions = questions.filter((q) => q !== dottedName)

  const relevantAnsweredQuestions = Object.keys(situation).filter((k) =>
    k.startsWith(dottedName),
  )
  const withAnsweredQuestions = [
    ...relevantAnsweredQuestions,
    ...relevantQuestions,
  ]

  //TODO problème, les questions disparaissent. C'est sûrement la raison de la gestion via . questions: des autres composants. On va pas laisser ça comme ça.
  console.log(
    'indigo',
    evaluation,
    value,
    relevantQuestions,
    answeredQuestions,
    situation,
    withAnsweredQuestions,
  )

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
        <div className="aide-details">
          {withAnsweredQuestions?.map((question, idx) => (
            <GesteQuestion
              key={idx}
              {...{
                rules,
                question,
                engine,
                situation,
                answeredQuestions,
                setSearchParams,
              }}
            />
          ))}
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
