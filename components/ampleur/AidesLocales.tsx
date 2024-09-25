import calculatorIcon from '@/public/calculator-empty.svg'
import Image from 'next/image'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'

import hexagoneIcon from '@/public/hexagone-contour.svg'
import AddressSearch from '../AddressSearch'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import useSetSearchParams from '../useSetSearchParams'
import { BlueEm } from '@/app/LandingUI'

const Hexagone = () => (
  <Image
    src={hexagoneIcon}
    alt="Icône représentant le territoire français métropolitaine"
  />
)
export default function AidesLocales({ rules, situation }) {
  const setSearchParams = useSetSearchParams()
  const dottedName = 'aides locales'
  const rule = rules[dottedName]
  //TODO gérer le cas logement . commune = ménage . commune. Dans enrichSituation ? Ou dans publicodes directement ? Publicodes si on peut !
  const communeName =
    situation['logement . commune . nom'] || situation['ménage . commune . nom']

  return (
    <AideAmpleur dottedName={dottedName}>
      <div>
        <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />

        {communeName ? (
          <p>
            Votre commune {communeName} <BlueEm>RESTE À TESTER</BlueEm>
          </p>
        ) : (
          <details>
            <summary>
              Nous ne connaissons pas votre commune, à vous de chercher son
              éligibilté aux aides locales, ou cliquez pour la saisir.
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
        )}

        <Card $background="#f7f8f8">
          <div
            css={`
              display: flex;
              align-items: center;
              margin-top: 1rem;
            `}
          >
            <Image
              src={calculatorIcon}
              alt="Icône calculette"
              css={`
                width: 3rem !important;
                height: auto !important;
                margin-right: 0.8rem !important;
              `}
            />
            <p>
              Par rapport à un prêt à la consommation de 50 000 € affecté aux
              travaux à un taux de 5 % sur 20 ans,
              <br /> l'éco-PTZ peut vous faire économiser{' '}
              <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-de-credit-immobilier/">
                <PrimeStyle>30 000 € d'intérêts</PrimeStyle>
              </a>
              .
            </p>
          </div>
        </Card>
        <InformationBlock>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].informationsUtilesHtml,
            }}
          />
        </InformationBlock>
        <PaymentTypeBlock>
          <p>Le prêt sera à rembourser mensuellement.</p>
        </PaymentTypeBlock>
        <AideCTA text="Demander le prêt à taux zéro">
          <p>
            L'éco-PTZ est disponible auprès de{' '}
            <a href="https://www2.sgfgas.fr/web/site-public/etablissements-affilies">
              ces établissements de crédits
            </a>
            . Découvrir{' '}
            <a href="https://www.service-public.fr/particuliers/vosdroits/F19905">
              la démarche étape par étape
            </a>
            .
          </p>
          <a href="https://www.impots.gouv.fr/particulier/questions/ai-je-droit-pour-ma-taxe-fonciere-lexoneration-en-faveur-des-economies">
            Plus d'infos sur impots.gouv.fr
          </a>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
