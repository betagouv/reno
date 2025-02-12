import { Card, MiseEnAvant } from '../UI'
import AideAmpleur from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import Input from '../Input'
import { encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import { Key } from '../explications/ExplicationUI'
import { Select } from '../InputUI'

export default function Denormandie({
  engine,
  exampleSituation,
  answeredQuestions,
  setSearchParams,
  expanded,
}) {
  const situation = {
    ...exampleSituation,
  }

  if (!situation['denormandie . années de location']) {
    situation['denormandie . années de location'] = 12
  }

  const communeName = situation['logement . commune . nom'],
    communeEligible = situation['logement . commune . denormandie']

  const isEligible = engine.evaluate('denormandie . montant').nodeValue

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
          La commune <Key $state={'prime-black'}>{communeName}</Key> de votre
          logement{' '}
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
          <Card $background="#EEEEFF">
            <p
              css={`
                line-height: 2rem;
              `}
            >
              Par exemple : j'achète un logement d'une valeur de{' '}
              <Input
                css={`
                  vertical-align: text-bottom;
                  padding: 0.2rem 0.3rem 0 0;
                  max-width: 8rem !important;
                  border-bottom: 2px solid #d1d1fb !important;
                  width: 6rem !important;
                `}
                autoFocus={false}
                value={situation["logement . prix d'achat"]}
                placeholder="250000"
                min="1000"
                onChange={(rawValue) => {
                  const value = +rawValue === 0 ? undefined : rawValue
                  setSearchParams(
                    encodeSituation({
                      "logement . prix d'achat": value,
                    }),
                    'replace',
                    false,
                  )
                }}
                step="1000"
              />
              €{' '}
              <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                HT
              </span>{' '}
              dans lequel je réalise des travaux de rénovation de{' '}
              <label>
                <Input
                  css={`
                    vertical-align: text-bottom;
                    padding: 0.2rem 0.3rem 0 0;
                    max-width: 6rem !important;
                  `}
                  autoFocus={false}
                  value={situation['projet . travaux']}
                  placeholder="mes travaux"
                  min="1000"
                  onChange={(rawValue) => {
                    const value = +rawValue === 0 ? undefined : rawValue
                    setSearchParams(
                      encodeSituation({
                        'projet . travaux': value,
                      }),
                      'replace',
                      false,
                    )
                  }}
                  step="1000"
                  css={`
                    border-bottom: 2px solid #d1d1fb !important;
                  `}
                />
                €{' '}
                <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                  HT.
                </span>
              </label>
            </p>
            <p
              css={`
                line-height: 2.2rem;
              `}
            >
              Pour une période de location de{' '}
              <Select
                defaultValue={'12'}
                onChange={(e) =>
                  setSearchParams(
                    encodeSituation({
                      'denormandie . années de location': e.target.value,
                    }),
                    'replace',
                    false,
                  )
                }
                css={`
                  font-weight: bold;
                  line-height: 1;
                  color: #000;
                  font-size: 95%;
                `}
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
                  state: 'prime-black',
                }}
              />{' '}
              du prix du bien
              {isEligible && (
                <>
                  {' '}
                  soit un total de{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'denormandie . montant',
                      state: 'prime-black',
                    }}
                  />{' '}
                  de réduction d'impôt étalée sur la durée de location
                </>
              )}
              .
            </p>
            {!isEligible && (
              <MiseEnAvant $type="warning" $noradius={true}>
                <h4
                  css={`
                    margin: 0 0 1rem;
                  `}
                >
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
              </MiseEnAvant>
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
