import { formatValue } from 'publicodes'
import AideAmpleur from './ampleur/AideAmpleur'
import { createExampleSituation } from './ampleur/AmpleurSummary'
import { encodeSituation } from './publicodes/situationUtils'
import { Card } from './UI'
import Value from './Value'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Select from '@codegouvfr/react-dsfr/Select'

export default function LocAvantage({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'locavantage'

  const exampleSituation = createExampleSituation(engine, situation, false)
  const extremeSituation = createExampleSituation(engine, situation, true)
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
      <Card>
        <p>
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
              value: 'loc 1',
            }}
            label="En appliquant un loyer :"
          >
            <option value="'loc 1'">15%</option>
            <option value="'loc 2'">30%</option>
            <option value="'loc 3'">45%</option>
          </Select>
          inférieur au marché pendant <Badge noIcon>6 ans</Badge> minimum et{' '}
          <Select
            nativeSelectProps={{
              onChange: (e) =>
                setSearchParams(
                  encodeSituation({
                    'locavantage . intermédiation locative': e.target.value,
                  }),
                  'replace',
                  false,
                ),
              value: 'oui',
            }}
          >
            <option value="oui">en passant</option>
            <option value="non">en ne passant pas</option>
          </Select>{' '}
          par un intermédiaire de gestion locative, vous bénéficiez d'une
          réduction d'impôt calculée sur les revenus bruts du logement loué de{' '}
          <Value
            {...{
              engine,
              situation,
              dottedName: 'locavantage . taux',
              state: 'normal',
            }}
          />
        </p>
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
      </Card>
    </AideAmpleur>
  )
}
