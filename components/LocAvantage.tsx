import { formatValue } from 'publicodes'
import AideAmpleur from './ampleur/AideAmpleur'
import { createExampleSituation } from './ampleur/AmpleurSummary'
import { encodeDottedName, encodeSituation } from './publicodes/situationUtils'
import { Card } from './UI'
import Value from './Value'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Select from '@codegouvfr/react-dsfr/Select'
import CalculatorWidget from './CalculatorWidget'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'
import { push } from '@socialgouv/matomo-next'

export default function LocAvantage({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'locavantage'
  const intermediaire = 'locavantage . intermédiation locative'

  const exampleSituation = createExampleSituation(situation)
  const extremeSituation = createExampleSituation(situation, 'best')
  const engineSituation = engine.setSituation(situation)
  const primeLocation = engineSituation.evaluate(
    dottedName + ' . prime location',
  )
  const primeGestion = engineSituation.evaluate(
    dottedName + ' . prime mandat gestion',
  )
  const primeSurface = engineSituation.evaluate(
    dottedName + ' . prime petite surface',
  )
  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName,
        setSearchParams,
        situation,
        answeredQuestions,
        exampleSituation,
        extremeSituation,
        expanded,
      }}
    >
      <h3>Comment est calculée l'aide ?</h3>
      <CalculatorWidget>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-6">
            <Select
              nativeSelectProps={{
                onChange: (e) =>
                  setSearchParams(
                    encodeSituation({
                      'locavantage . niveau loyer': e.target.value,
                    }),
                    'replace',
                    false,
                  ),
                value: situation['locavantage . niveau loyer'],
              }}
              label="Loyer inférieur au marché de :"
            >
              <option value="'loc 1'">15%</option>
              <option value="'loc 2'">30%</option>
              <option value="'loc 3'">45%</option>
            </Select>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <RadioButtons
              legend="Intermédiaire de gestion locative : "
              orientation="horizontal"
              options={[
                {
                  label: 'Oui',
                  nativeInputProps: {
                    value: 'oui',
                    checked: situation[intermediaire] === 'oui',
                    onChange: () => {
                      push([
                        'trackEvent',
                        'LocAvantage',
                        'Interaction',
                        'intermediaire',
                      ])
                      setSearchParams({
                        [encodeDottedName(intermediaire)]: 'oui*',
                      })
                    },
                  },
                },
                {
                  label: 'Non',
                  nativeInputProps: {
                    value: 'non',
                    checked: situation[intermediaire] === 'non',
                    onChange: () => {
                      push([
                        'trackEvent',
                        'LocAvantage',
                        'Interaction',
                        'intermediaire',
                      ])
                      setSearchParams({
                        [encodeDottedName(intermediaire)]: 'non*',
                      })
                    },
                  },
                },
              ]}
              nativeSelectProps={{
                onChange: (e) =>
                  setSearchParams(
                    encodeSituation({
                      'locavantage . intermédiation locative': !e.target.value
                        ? undefined
                        : e.target.value,
                    }),
                    'replace',
                    false,
                  ),
                value: situation['locavantage . intermédiation locative'],
              }}
            >
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </RadioButtons>
          </div>
        </div>
        <p>
          En louant ce logement pendant <strong>6 ans minimum</strong>, vous
          bénéficiez d'une réduction d'impôt calculée sur les revenus bruts du
          logement loué de :
        </p>
        <div style={{ textAlign: 'center' }}>
          <Value
            {...{
              engine,
              situation,
              dottedName: 'locavantage . taux',
              className: 'fr-my-2v',
              state: 'success',
              size: 'xl',
            }}
          />
        </div>
        {primeLocation.nodeValue && (
          <>
            <p>De plus, vous aurez droit à:</p>
            <ul>
              <li>
                une prime de <Badge noIcon>{formatValue(primeLocation)}</Badge>{' '}
                en cas de recours à la location/sous-location
              </li>
              <li>
                une prime de <Badge noIcon>{formatValue(primeGestion)}</Badge>{' '}
                en cas de recours à un mandat de gestion
              </li>
              {primeSurface.nodeValue && (
                <li>
                  une prime de <Badge noIcon>{formatValue(primeSurface)}</Badge>{' '}
                  car le logement est inférieur à 40m²
                </li>
              )}
            </ul>
          </>
        )}
      </CalculatorWidget>
    </AideAmpleur>
  )
}
