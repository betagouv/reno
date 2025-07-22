import { Card } from '../UI'
import AideAmpleur from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import { encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import { roundToThousands } from '../utils'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Select from '@codegouvfr/react-dsfr/Select'
import Input from '@codegouvfr/react-dsfr/Input'

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
          <Card>
            <p>
              Par exemple : j'achète un logement d'une valeur de{' '}
              <Input
                nativeInputProps={{
                  type: 'number',
                  name: 'prix-achat',
                  min: 1000,
                  step: 1000,
                  onChange: (rawValue) => {
                    const value = +rawValue === 0 ? undefined : rawValue
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
              dans lequel je réalise des travaux de rénovation de{' '}
              <Input
                nativeInputProps={{
                  type: 'number',
                  name: 'prix-achat',
                  min: 1000,
                  step: 1000,
                  onChange: (rawValue) => {
                    const value = +rawValue === 0 ? undefined : rawValue
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
            </p>
            <p>
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
                  value: '12',
                }}
                label="Pour une période de location de :"
              >
                <option value="6">6 ans</option>
                <option value="9">9 ans</option>
                <option value="12">12 ans</option>
              </Select>{' '}
              : la réduction d'impôt s'élèverait à{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'denormandie . taux',
                }}
              />{' '}
              du prix du bien
              {isSeuilTravauxAtteint && (
                <>
                  {' '}
                  soit un total de{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'denormandie . montant',
                      state: 'prime',
                    }}
                  />{' '}
                  de réduction d'impôt étalée sur la durée de location
                </>
              )}
              .
            </p>
            {!isSeuilTravauxAtteint && (
              <div className="fr-callout fr-callout--yellow-moutarde">
                <h4>
                  Attention : les conditions d'éligibilité ne sont pas remplies.
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
          </Card>
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
