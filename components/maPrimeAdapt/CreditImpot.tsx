import rules from '@/app/règles/rules'
import AideAmpleur from '../ampleur/AideAmpleur'
import CalculatorWidget from '../CalculatorWidget'
import Value from '../Value'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'
import { encodeDottedName } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import { BlocMontantTravaux } from './MaPrimeAdapt'
import Input from '@codegouvfr/react-dsfr/Input'

export default function CreditImpot({
  isEligible,
  engine,
  situation,
  setSearchParams,
  dottedName,
  answeredQuestions,
  expanded,
}) {
  const typeMenage = dottedName + ' . type ménage'
  const exampleSituation = createExampleSituation(situation)
  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName: dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      <h3>Comment est calculée l'aide ?</h3>
      <CalculatorWidget>
        <div className="fr-grid-row fr-grid-row--gutters fr-mt-5v">
          <div className="fr-col-12 fr-col-md-6">
            {' '}
            <RadioButtons
              legend="Je suis : "
              orientation="horizontal"
              options={rules[typeMenage]['une possibilité parmi'][
                'possibilités'
              ].map((item) => {
                return {
                  label: rules[typeMenage + ' . ' + item]?.titre,
                  nativeInputProps: {
                    value: rules[typeMenage + ' . ' + item]?.valeur,
                    checked:
                      situation[typeMenage] ==
                      rules[typeMenage + ' . ' + item]?.valeur,
                    onChange: (e) => {
                      push([
                        'trackEvent',
                        dottedName,
                        'Interaction',
                        'typeMenage',
                      ])
                      setSearchParams({
                        [encodeDottedName(typeMenage)]: e.target.value + '*',
                      })
                    },
                  },
                }
              })}
            />
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <Input
              label="Nombre de parts fiscales :"
              nativeInputProps={{
                type: 'number',
                min: 1,
                step: 0.5,
                onChange: (e) => {
                  const val = e.target.value
                  const invalid = (isNaN(val) || val <= 0) && val != ''
                  console.log('val', val, invalid)
                  if (invalid) return
                  push(['trackEvent', 'Module', dottedName, 'nb part ' + val])
                  setSearchParams({
                    [encodeDottedName(dottedName + ' . nombre parts')]: val
                      ? val + '*'
                      : undefined,
                  })
                },
                value: answeredQuestions.includes(
                  dottedName + ' . nombre parts',
                )
                  ? situation[dottedName + ' . nombre parts']
                  : '',
              }}
            />
          </div>
        </div>
        <BlocMontantTravaux
          {...{
            engine,
            situation,
            exampleSituation,
            dottedName,
            setSearchParams,
          }}
        />
        {situation[dottedName + ' . nombre parts'] && (
          <div className="fr-highlight fr-highlight--yellow-moutarde fr-my-5v">
            Sous réserve que l'ensemble des revenus du ménage ne dépasse pas :{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: dottedName + ' . limite revenu',
                state: 'normal',
              }}
            />
          </div>
        )}
        <p>De plus, vous aurez droit à:</p>
        <ul>
          <li>
            <Value
              {...{
                engine,
                situation,
                dottedName: dottedName + ' . supplément personne à charge',
              }}
            />{' '}
            par personne à charge
          </li>
          <li>
            <Value
              {...{
                engine,
                situation,
                dottedName:
                  dottedName + ' . supplément enfant résidence alternée',
              }}
            />{' '}
            par enfant en résidence alternée
          </li>
        </ul>
      </CalculatorWidget>
      {expanded && (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].explicationHTML,
            }}
          />
        </>
      )}
    </AideAmpleur>
  )
}
