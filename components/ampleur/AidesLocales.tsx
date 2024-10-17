import calculatorIcon from '@/public/calculator-empty.svg'
import Image from 'next/image'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'

import { BlueEm } from '@/app/LandingUI'
import rules from '@/app/règles/rules'
import hexagoneIcon from '@/public/hexagone-contour.svg'
import AddressSearch from '../AddressSearch'
import { encodeSituation } from '../publicodes/situationUtils'
import AidesLocalesByLevel from './AidesLocalesByLevel'
import { findAidesLocales } from './useAides'
import MapBehindCTA from '../MapBehindCTA'

const levels = rules['aides locales . montant'].somme

const Hexagone = () => (
  <Image
    src={hexagoneIcon}
    alt="Icône représentant le territoire français métropolitaine"
  />
)
export default function AidesLocales({
  rules,
  situation,
  searchParams,
  engine,
  setSearchParams,
  answeredQuestions,
  expanded
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
      <AideAmpleur {...{
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded
      }}>
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

  return (
    <AideAmpleur {...{
      engine,
      dottedName,
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      <ul>
        {levels.map((level) => (
          <AidesLocalesByLevel
            {...{ aides, level, situation, engine, rules }}
            key={level}
          />
        ))}
      </ul>
    </AideAmpleur>
  )
}
