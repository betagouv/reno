import calculatorIcon from '@/public/calculator-empty.svg'
import Image from 'next/image'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'

import { BlueEm } from '@/app/LandingUI'
import rules from '@/app/règles/rules'
import hexagoneIcon from '@/public/hexagone-contour.svg'
import questionIcon from '@/public/remix-question-empty.svg'
import AddressSearch from '../AddressSearch'
import { encodeSituation } from '../publicodes/situationUtils'
import useSetSearchParams from '../useSetSearchParams'
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
}) {
  const setSearchParams = useSetSearchParams()
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

  console.log('lightbrown aide locale', aides)
  if (!communeName && !commune)
    return (
      <AideAmpleur dottedName={dottedName}>
        <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />

        <details>
          <summary>
            Nous ne connaissons pas votre commune, à vous de chercher son
            éligibilté aux aides locales, ou{' '}
            <BlueEm>cliquez pour la saisir</BlueEm>.
          </summary>

          <AddressSearch
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
    <AideAmpleur dottedName={dottedName}>
      <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />

      <ul>
        {levels.map((level) => (
          <AidesLocalesByLevel
            {...{ aides, level, situation, engine, rules }}
            key={level}
          />
        ))}
      </ul>

      <AideCTA text="Découvrir les aides locales">
        <p>
          N'hésitez pas à consulter la{' '}
          <a href="https://www.anil.org/aides-locales-travaux/">
            base des aides locale de l'ANIL
          </a>
          , les sites d'information de vos collectivités, ou votre conseiller
          France Rénov'.
        </p>
        <MapBehindCTA
          {...{
            situation,
            searchParams,
            what: 'trouver-conseiller-renov',
            text: 'Trouver mon conseiller',
            link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
            importance: 'secondary',
          }}
        />
      </AideCTA>
    </AideAmpleur>
  )
}
