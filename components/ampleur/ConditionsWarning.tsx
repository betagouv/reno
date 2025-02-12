import rules from '@/app/règles/rules'
import { encodeSituation } from '../publicodes/situationUtils'
import { MiseEnAvant } from '../UI'
import { No } from '../ResultUI'
import { Key } from '../explications/ExplicationUI'

export const ConditionsWarning = ({
  dottedName,
  setSearchParams,
  engine,
  situation,
  answeredQuestions,
}) => {
  const conditions =
    dottedName == "CEE . rénovation d'ampleur"
      ? rules["CEE . rénovation d'ampleur . conditions"][
          'toutes ces conditions'
        ]
      : dottedName == 'ampleur . prime individuelle copropriété'
        ? rules[dottedName + ' . montant']['applicable si'][
            'toutes ces conditions'
          ]
        : dottedName == 'MPR . accompagnée . prise en charge MAR'
          ? [rules[dottedName]['applicable si']]
          : dottedName == 'PTZ'
            ? rules[dottedName + ' . conditions . communes']['valeur'][
                'toutes ces conditions'
              ]
            : dottedName == 'PAR'
              ? rules[dottedName + ' . conditions . communes']['valeur'][
                  'toutes ces conditions'
                ]
              : dottedName == 'taxe foncière'
                ? rules[dottedName + ' . conditions']['toutes ces conditions']
                : dottedName == 'MPR . accompagnée'
                  ? rules['conditions communes']['toutes ces conditions'] //on ignore la condition de saut que l'on force et qui est donc forcément respectées
                  : []

  const notRespectedConditions = conditions
    .filter((cond) => cond != 'condition de dépenses') // Cette condition pour la Taxe Foncière est un peu particulière puisqu'on ne demande pas le montant de dépense
    .filter((cond) => {
      let conditionToEvaluate = rules[cond]
        ? cond
        : Object.keys(rules).find(
              (k) => k.startsWith(dottedName) && k.endsWith(cond),
            )
          ? Object.keys(rules).find(
              (k) => k.startsWith(dottedName) && k.endsWith(cond),
            )
          : cond

      return !engine.setSituation(situation).evaluate(conditionToEvaluate)
        .nodeValue
    })

  if (!notRespectedConditions.length) return null
  console.log('notRespectedConditions', notRespectedConditions)
  const urlMPRA = setSearchParams(
    {
      ...encodeSituation(
        { ...situation, details: 'MPR.accompagnée' },
        false,
        answeredQuestions,
      ),
    },
    'url',
    true,
  )

  const explanationCondition = {
    'vous . propriétaire . condition': (
      <>Vous n'êtes pas propriétaire du logement.</>
    ),
    'MPR . accompagnée . éligible': (
      <>
        Vous ne semblez pas être éligible à{' '}
        <a href={urlMPRA}>MaPrimeRénov' Parcours Accompagnée</a>.
      </>
    ),
    'MPR . accompagnée . éligible = non': (
      <>
        Vous semblez être éligible à{' '}
        <a href={urlMPRA}>MaPrimeRénov' Parcours Accompagnée</a> qui propose une
        aide plus avantageuse, ce qui vous rend inéligible au coup de pouce
        "Rénovation d'ampleur".
      </>
    ),
    'logement . type = "appartement"': (
      <>Vous ne semblez pas vivre dans une copropriété.</>
    ),
    'logement . résidence principale': (
      <>Ce logement n'est pas votre résidence principale.</>
    ),
    'logement . propriétaire occupant': (
      <>Vous n'êtes pas propriétaire occupant.</>
    ),
    'logement . au moins 2 ans': (
      <>Ce logement a été construit il y a moins de 2 ans.</>
    ),
    'logement . au moins 15 ans': (
      <>Ce logement a été construit il y a moins de 15 ans.</>
    ),
    'commune . éligible': (
      <>
        La commune{' '}
        <Key $state={'prime-black'}>
          {situation['logement . commune . nom'] ||
            situation['ménage . commune . nom']}
        </Key>{' '}
        de votre logement
        <No>n'a pas appliqué</No> l'exonération de taxe foncière l'année
        dernière.
      </>
    ),
    revenu: <>Vos revenus sont supérieurs au seuil fixé.</>,
  }
  return (
    <MiseEnAvant
      $type="warning"
      $noradius={true}
      css={`
        margin-top: 1rem;
      `}
    >
      <h4
        css={`
          margin: 0 0 1rem;
        `}
      >
        Attention : les conditions d'éligibilité ne semblent pas remplies.
      </h4>
      <p>Dans votre situation, vous ne semblez pas être éligible car:</p>
      <ul>
        {notRespectedConditions.map((notRespectedCondition) => (
          <li key={notRespectedCondition}>
            {explanationCondition[notRespectedCondition]}
          </li>
        ))}
      </ul>
    </MiseEnAvant>
  )
}

export default ConditionsWarning
