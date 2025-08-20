import { Card } from '../UI'
import AideAmpleur from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import { encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import { roundToThousands } from '../utils'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Select from '@codegouvfr/react-dsfr/Select'
import Input from '@codegouvfr/react-dsfr/Input'
import CalculatorWidget from '../CalculatorWidget'
import AmpleurCTA from '@/app/module/AmpleurCTA'

export default function Denormandie({
  isEligible,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
  expanded,
}) {
  if (!situation['denormandie . années de location']) {
    situation['denormandie . années de location'] = 12
  }
  if (!situation["logement . prix d'achat"]) {
    situation["logement . prix d'achat"] = 150000
  }
  // Si le montant des travaux n'est pas précisé, on l'estime
  if (!situation['projet . travaux']) {
    situation['projet . travaux'] = roundToThousands(
      engine.evaluate('projet . enveloppe estimée').nodeValue
        ? engine.evaluate('projet . enveloppe estimée').nodeValue
        : 0,
      5,
    )
  }

  const communeName = situation['logement . commune . nom'],
    communeEligible = situation['logement . commune . denormandie']

  const isSeuilTravauxAtteint = engine
    .setSituation(situation)
    .evaluate('denormandie . seuil travaux minimum').nodeValue
  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName: 'denormandie',
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {communeName && communeEligible && (
        <p>
          La commune <Badge noIcon>{communeName}</Badge> de votre logement{' '}
          {communeEligible === 'oui' ? (
            <Yes>est éligible</Yes>
          ) : (
            <No>n'est pas éligible</No>
          )}{' '}
          au dispositif Denormandie.
        </p>
      )}
      {expanded && (
        <>
          <CalculatorWidget>
            <div className="fr-callout__text">
              <Input
                label="Par exemple : j'achète un logement d'une valeur de "
                nativeInputProps={{
                  type: 'number',
                  name: 'prix-achat',
                  min: 1000,
                  step: 1000,
                  onChange: (e) => {
                    const value =
                      +e.target.value === 0 ? undefined : e.target.value
                    setSearchParams(
                      encodeSituation({
                        "logement . prix d'achat": value,
                      }),
                      'replace',
                      false,
                    )
                  },
                  value: situation["logement . prix d'achat"],
                }}
                addon={
                  <>
                    €
                    <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                      HT
                    </span>
                  </>
                }
              />{' '}
              <Input
                label="je réalise des travaux de rénovation de "
                nativeInputProps={{
                  type: 'number',
                  name: 'prix-achat',
                  min: 1000,
                  step: 1000,
                  onChange: (e) => {
                    const value =
                      +e.target.value === 0 ? undefined : e.target.value
                    setSearchParams(
                      encodeSituation({
                        'projet . travaux': value,
                      }),
                      'replace',
                      false,
                    )
                  },
                  value: situation['projet . travaux'],
                }}
                addon={
                  <>
                    €
                    <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                      HT
                    </span>
                  </>
                }
              />
              <Select
                nativeSelectProps={{
                  onChange: (e) =>
                    setSearchParams(
                      encodeSituation({
                        'denormandie . années de location': e.target.value,
                      }),
                      'replace',
                      false,
                    ),
                  value: situation['denormandie . années de location'],
                }}
                label="Pour une période de location de :"
              >
                <option value="6">6 ans</option>
                <option value="9">9 ans</option>
                <option value="12">12 ans</option>
              </Select>{' '}
              {isSeuilTravauxAtteint && (
                <div className="fr-callout">
                  <h2 className="fr-callout__title">🥳 Résultats</h2>
                  <p className="fr-callout__text">Vous êtes éligible à :</p>
                  <div className="fr-callout__text">
                    <p className="fr-mb-3v">
                      Une réduction d'impôt de{' '}
                      <Value
                        {...{
                          size: 'xl',
                          state: 'success',
                          engine,
                          situation,
                          dottedName: 'denormandie . taux',
                        }}
                      />{' '}
                      du prix du bien soit un total de{' '}
                      <Value
                        {...{
                          size: 'xl',
                          state: 'success',
                          engine,
                          situation,
                          dottedName: 'denormandie . montant',
                        }}
                      />{' '}
                      de réduction d'impôt étalée sur la durée de location
                    </p>
                  </div>
                  <AmpleurCTA {...{ situation: situation }} />
                </div>
              )}
              {!isSeuilTravauxAtteint && (
                <div className="fr-callout fr-callout--yellow-moutarde">
                  <h4>
                    Attention : les conditions d'éligibilité ne sont pas
                    remplies.
                  </h4>
                  Pour être éligible, les travaux doivent représenter au minimum{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'denormandie . travaux minimum',
                      state: 'prime-black',
                    }}
                  />{' '}
                  HT (25 % du prix de revient: achat + travaux).
                </div>
              )}
            </div>
          </CalculatorWidget>
          <h3>Carte des villes éligibles au dispositif Denormandie</h3>
          <iframe
            css={`
              border-radius: 0.3rem;
            `}
            width="100%"
            height="340px"
            frameBorder="0"
            allowFullScreen
            allow="geolocation"
            src="//umap.openstreetmap.fr/fr/map/le-dispositif-denormandie-une-aide-fiscale-dans-vo_289689?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=false&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=false&onLoadPanel=none&captionBar=false&captionMenus=true"
          ></iframe>
        </>
      )}
    </AideAmpleur>
  )
}
