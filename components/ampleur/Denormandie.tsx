import AideAmpleur from './AideAmpleur'
import { No, Yes } from '../ResultUI'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Select from '@codegouvfr/react-dsfr/Select'
import Input from '@codegouvfr/react-dsfr/Input'
import CalculatorWidget from '../CalculatorWidget'
import { formatNumberWithSpaces } from '../utils'

export default function Denormandie({
  isEligible,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
  expanded,
}) {
  const communeName = situation['logement . commune . nom'],
    communeEligible = situation['logement . commune . denormandie']
  const isSeuilCalculable = Boolean(
    situation["logement . prix d'achat"] && situation['projet . travaux'],
  )
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
            <div className="fr-grid-row fr-grid-row--gutters fr-mb-5v">
              <div className="fr-col-12 fr-col-md-4">
                <Input
                  label="Prix d'achat du bien"
                  nativeInputProps={{
                    pattern: '\d+',
                    inputMode: 'numeric',
                    type: 'text',
                    onChange: (e) => {
                      const price = e.target.value.replace(/\s/g, '')
                      const invalid =
                        price != '' && (isNaN(price) || price <= 0)
                      if (invalid) return

                      setSearchParams({
                        [encodeDottedName("logement . prix d'achat")]:
                          price == '' ? undefined : price + '*',
                      })
                    },
                    value: situation["logement . prix d'achat"]
                      ? formatNumberWithSpaces(
                          situation["logement . prix d'achat"],
                        )
                      : '',
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
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <Input
                  label="Montant des travaux"
                  nativeInputProps={{
                    pattern: '\d+',
                    inputMode: 'numeric',
                    type: 'text',
                    onChange: (e) => {
                      const price = e.target.value.replace(/\s/g, '')
                      const invalid =
                        price != '' && (isNaN(price) || price <= 0)
                      if (invalid) return

                      setSearchParams({
                        [encodeDottedName('projet . travaux')]:
                          price == '' ? undefined : price + '*',
                      })
                    },
                    value: situation['projet . travaux']
                      ? formatNumberWithSpaces(situation['projet . travaux'])
                      : '',
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
              </div>
              <div className="fr-col-12 fr-col-md-4">
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
                  label="Durée de location"
                >
                  <option value=""></option>
                  <option value="6">6 ans</option>
                  <option value="9">9 ans</option>
                  <option value="12">12 ans</option>
                </Select>
              </div>
            </div>
            {isSeuilCalculable && isSeuilTravauxAtteint && (
              <div>
                <p className="fr-callout__text">
                  🥳 Vous êtes éligible à <strong>une réduction d'impôt</strong>{' '}
                  de{' '}
                  <Value
                    {...{
                      state: 'normal',
                      engine,
                      situation,
                      dottedName: 'denormandie . taux',
                    }}
                  />{' '}
                  du coût total du bien soit un total de:
                </p>
                <p
                  className="fr-callout__text fr-mt-5v"
                  style={{ textAlign: 'center' }}
                >
                  <Value
                    {...{
                      size: 'xl',
                      state: 'success',
                      engine,
                      situation,
                      dottedName: 'denormandie . montant',
                    }}
                  />{' '}
                  étalée sur la durée de location
                </p>
              </div>
            )}{' '}
            {isSeuilCalculable && !isSeuilTravauxAtteint && (
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
                  }}
                />{' '}
                HT (25 % du prix de revient: achat + travaux).
              </div>
            )}
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
