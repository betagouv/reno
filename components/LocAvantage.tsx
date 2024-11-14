import { formatValue } from 'publicodes'
import AideAmpleur from './ampleur/AideAmpleur'
import { createExampleSituation } from './ampleur/AmpleurSummary'
import { Key } from './explications/ExplicationUI'
import Input from './Input'
import { Select } from './InputUI'
import { encodeSituation } from './publicodes/situationUtils'
import { Card, Section } from './UI'
import Value from './Value'
import checkIcon from '@/public/check.svg'

export default function LocAvantage({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  rules,
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
    <Section>
      <AideAmpleur
        {...{
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
        <Card $background="#f7f8f8">
          <p>
            En appliquant un loyer{' '}
            <Select
              defaultValue={'loc 1'}
              onChange={(e) =>
                setSearchParams(
                  encodeSituation({
                    'locavantage . niveau loyer': e.target.value,
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
              <option value="'loc 1'">15%</option>
              <option value="'loc 2'">30%</option>
              <option value="'loc 3'">45%</option>
            </Select>{' '}
            inférieur au marché pendant <Key state="prime-black">6 ans</Key>{' '}
            minimum et{' '}
            <Select
              defaultValue={'loc 1'}
              onChange={(e) =>
                setSearchParams(
                  encodeSituation({
                    'locavantage . intermédiation locative': e.target.value,
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
                state: 'prime-black',
              }}
            />
          </p>
          {primeLocation.nodeValue && (
            <>
              <p>De plus, vous aurez droit à:</p>
              <ul
                css={`
                  li {
                    margin-bottom: 0.5rem;
                  }
                `}
              >
                <li>
                  une prime de{' '}
                  <Key state="prime-black">{formatValue(primeLocation)}</Key> en
                  cas de recours à la location/sous-location
                </li>
                <li>
                  une prime de{' '}
                  <Key state="prime-black">{formatValue(primeGestion)}</Key> en
                  cas de recours à un mandat de gestion
                </li>
                {primeSurface.nodeValue && (
                  <li>
                    une prime de{' '}
                    <Key state="prime-black">{formatValue(primeSurface)}</Key>{' '}
                    car le logement est inférieur à 40m²
                  </li>
                )}
              </ul>
            </>
          )}
        </Card>
        {expanded && (
          <>
            <h3>Les principales conditions d'éligibilité ?</h3>
            <div
              css={`
                list-style-image: url(${checkIcon.src});
                li {
                  margin: 1rem 0;
                  ul {
                    list-style-image: none;
                  }
                }
              `}
              dangerouslySetInnerHTML={{
                __html: rules[dottedName].conditionsEligibilitesHTML,
              }}
            />
          </>
        )}
      </AideAmpleur>
    </Section>
  )
}
