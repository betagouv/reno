import calculatorIcon from '@/public/calculator-empty.svg'
import Image from 'next/image'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'

import { BlueEm } from '@/app/LandingUI'
import hexagoneIcon from '@/public/hexagone-contour.svg'
import crossIcon from '@/public/remix-close-empty.svg'
import questionIcon from '@/public/remix-question-empty.svg'
import AddressSearch from '../AddressSearch'
import { encodeSituation } from '../publicodes/situationUtils'
import useSetSearchParams from '../useSetSearchParams'
import { findAideLocale } from './useAides'

const Hexagone = () => (
  <Image
    src={hexagoneIcon}
    alt="Icône représentant le territoire français métropolitaine"
  />
)
export default function AidesLocales({ rules, situation, engine }) {
  const setSearchParams = useSetSearchParams()
  const dottedName = 'aides locales'
  const rule = rules[dottedName]
  //TODO gérer le cas logement . commune = ménage . commune. Dans enrichSituation ? Ou dans publicodes directement ? Publicodes si on peut !
  const communeName =
    situation['logement . commune . nom'] || situation['ménage . commune . nom']

  const { name, evaluation } = findAideLocale(rules, engine)

  console.log('orange aide locale', name, evaluation)
  if (!communeName)
    return (
      <AideAmpleur dottedName={dottedName}>
        <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />

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
      </AideAmpleur>
    )

  return (
    <AideAmpleur dottedName={dottedName}>
      <p dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }} />

      {!name ? (
        <Card $background="#f7f8f8">
          <div
            css={`
              display: flex;
              align-items: center;
              margin-top: 1rem;
            `}
          >
            <Image
              src={questionIcon}
              alt="Icône de question"
              css={`
                width: 3rem !important;
                height: auto !important;
                margin-right: 0.8rem !important;
              `}
            />
            <div>
              <p>
                Nous n'avons <BlueEm>pas trouvé d'aide locale</BlueEm> pour
                votre commune {communeName}. Cela ne veut pas dire qu'il n'y en
                a pas, car notre base des aides n'est pas encore complète.
              </p>
              <p>
                N'hésitez pas à consulter la{' '}
                <a href="https://www.anil.org/aides-locales-travaux/">
                  base des aides locale de l'ANIL
                </a>
                .
              </p>
            </div>
          </div>
        </Card>
      ) : !(evaluation.nodeValue > 0) ? (
        <Card $background="#f7f8f8">
          <div
            css={`
              display: flex;
              align-items: center;
              margin-top: 1rem;
            `}
          >
            <Image
              src={crossIcon}
              alt="Icône calculette"
              css={`
                width: 3rem !important;
                height: auto !important;
                margin-right: 0.8rem !important;
              `}
            />
            <p>
              Nous n'avons <BlueEm>pas trouvé d'aide locale</BlueEm> pour votre
              commune {communeName}. Cela ne veut pas dire qu'il n'y en a pas,
              car notre base des aides n'est pas encore complète.
            </p>
            <p>
              N'hésitez pas à consulter la{' '}
              <a href="https://www.anil.org/aides-locales-travaux/">
                base des aides locale de l'ANIL
              </a>
              .
            </p>
          </div>
        </Card>
      ) : (
        <section>
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
              OUi !
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
        </section>
      )}
    </AideAmpleur>
  )
}
