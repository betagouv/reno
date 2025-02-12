import AideAmpleur from './AideAmpleur'
import { BlueEm } from '@/app/LandingUI'
import rules from '@/app/règles/rules'
import AddressSearch from '../AddressSearch'
import { encodeSituation } from '../publicodes/situationUtils'
import AidesLocalesByLevel from './AidesLocalesByLevel'
import { findAidesLocales } from './useAides'
import { Key } from '../explications/ExplicationUI'

const levels = rules['aides locales . montant'].somme

export default function AidesLocales({
  rules,
  situation,
  engine,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'aides locales'
  const rule = rules[dottedName]
  //TODO gérer le cas logement . commune = ménage . commune. Dans enrichSituation ? Ou dans publicodes directement ? Publicodes si on peut !
  const communeName =
    situation['logement . commune . nom'] || situation['ménage . commune . nom']
  const commune =
    situation['logement . commune'] ||
    (situation['logement . propriétaire occupant'] === 'oui' &&
      situation['ménage . commune'])

  const aides = findAidesLocales(rules, engine)
  if (!communeName && !commune)
    return (
      <AideAmpleur
        {...{
          engine,
          dottedName,
          setSearchParams,
          answeredQuestions,
          situation,
          expanded,
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />

        <details>
          <summary>
            Nous ne connaissons pas votre commune, à vous de chercher son
            éligibilté aux aides locales, ou{' '}
            <BlueEm>cliquez pour la saisir</BlueEm>.
          </summary>

          <AddressSearch
            type="logement . commune"
            setChoice={(result) => {
              console.log('orange', result)
              setSearchParams(
                encodeSituation({
                  'logement . commune': `'${result.code}'`,
                  'logement . commune . nom': `'${result.nom}'`,
                }),
              )
            }}
          />
        </details>
      </AideAmpleur>
    )

  if (aides.length === 0)
    return (
      <AideAmpleur
        {...{
          engine,
          dottedName,
          setSearchParams,
          answeredQuestions,
          situation,
          expanded,
        }}
      >
        <p>
          <strong>Nous ne disposons pas d'informations</strong> sur les aides
          locales de votre commune{' '}
          <Key $state={'prime-black'}>{communeName || commune}</Key>.
        </p>
      </AideAmpleur>
    )

  const activeLevels = levels.filter((level) => {
    const activeAide = aides.find((aide) => aide.level === level)
    const rule = activeAide && rules[activeAide.dottedName]
    return rule != null
  })
  const num = activeLevels.length,
    plural = num > 1 ? 's' : ''
  return (
    <AideAmpleur
      {...{
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      <p>
        Il existe au moins {num} aide{plural} locale{plural} sur votre
        territoire.
      </p>
      <ul>
        {activeLevels
          .map((level) => {
            return (
              <AidesLocalesByLevel
                {...{ aides, level, situation, engine, rules, expanded }}
                key={level}
              />
            )
          })
          .filter(Boolean)}
      </ul>
    </AideAmpleur>
  )
}
