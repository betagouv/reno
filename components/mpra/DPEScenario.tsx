import Value from '@/components/Value'
import { encodeSituation } from '../publicodes/situationUtils'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import TargetDPETabs from './TargetDPETabs'
import CalculatorWidget from '../CalculatorWidget'
import Input from '@codegouvfr/react-dsfr/Input'
import useIsMobile from '../useIsMobile'
import { formatNumberWithSpaces } from '../utils'

export default function DPEScenario({ engine, situation, setSearchParams }) {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value) : automaticChoice

  const isMobile = useIsMobile()
  const engineSituation = engine.setSituation(situation)
  const revenuClasseValue = engineSituation.evaluate(
    'ménage . revenu . classe',
  ).nodeValue

  const isModeste = revenuClasseValue.includes('modeste')
  const montantTravaux =
    situation['projet . travaux'] ||
    engineSituation.evaluate('projet . travaux').nodeValue
  const futureSituation = {
    ...situation,
    'projet . DPE visé': choice + 1,
    'projet . travaux': montantTravaux,
  }
  return (
    <CalculatorWidget>
      <DPEQuickSwitch
        situation={situation}
        noSuccess
        ecartClasse={2}
        possibilities={[2, 3, 4, 5, 6]}
      />
      <TargetDPETabs
        {...{
          ecartClasse: 2,
          setSearchParams,
          noSuccess: true,
          situation,
        }}
      />
      <div className="fr-fieldset">
        <Input
          label="Budget de travaux de rénovation :"
          nativeInputProps={{
            pattern: '\d+',
            type: 'text',
            autoFocus: false,
            value: montantTravaux ? formatNumberWithSpaces(montantTravaux) : '',
            onChange: (e) => {
              const price = e.target.value.replace(/\s/g, '')
              const invalid = price != '' && (isNaN(price) || price <= 0)
              if (invalid) return
              setSearchParams(
                encodeSituation({
                  'projet . travaux': price == '' ? undefined : price + '*',
                }),
                'replace',
                false,
              )
              e.target.value = formatNumberWithSpaces(price)
            },
            min: '0',
            max: '999999',
            step: '100',
            name: 'budget',
            inputMode: 'numeric',
            required: true,
          }}
          addon={
            <>
              <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                € HT
              </span>
              <span
                css={`
                  text-align: center;
                  font-style: italic;
                  em {
                    font-weight: normal !important;
                  }
                `}
              >
                (soit
                <Value
                  {...{
                    engine,
                    choice,
                    situation: futureSituation,
                    dottedName: 'projet . travaux . TTC',
                  }}
                />
                <span title="En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                  {' '}
                  TTC
                </span>
                )
              </span>
            </>
          }
        />
      </div>

      <>
        <h2 className="fr-callout__title fr-mt-8v">🥳 Résultats</h2>
        <div className="fr-callout__text">
          {oldIndex < 2 ? (
            <p>
              👌 Votre logement est trop performant (A&nbsp;ou&nbsp;B) pour
              bénéficier du parcours accompagné.
            </p>
          ) : (
            <>
              Vous êtes éligible à une aide de{' '}
              <Value
                {...{
                  size: 'xl',
                  state: 'success',
                  engine,
                  situation: futureSituation,
                  dottedName: 'MPR . accompagnée . pourcent',
                }}
              />{' '}
              du coût de vos travaux{' '}
              <span className="fr-hint-text">
                avec un plafond de
                <Value
                  {...{
                    engine,
                    situation: futureSituation,
                    dottedName: 'projet . travaux . plafond',
                  }}
                />
                de travaux.
              </span>
              {isModeste && (
                <p className="fr-my-5v">
                  🍀 <strong>Bonus :</strong> En tant que ménage{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'ménage . revenu . classe',
                      state: 'prime-black',
                    }}
                  />{' '}
                  ,{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'MPR . accompagnée . pourcentage avance',
                      state: 'prime-black',
                    }}
                  />{' '}
                  de cette aide peut vous être versée en avance de vos travaux.
                </p>
              )}
              <div
                css={`
                  display: flex;
                  justify-content: space-between;
                  gap: 1rem;
                  ${isMobile && 'flex-direction: column;'}
                  > div {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                  }
                `}
              >
                <div>
                  <p className="fr-callout__text">
                    Vous toucherez un total d'aides de :
                  </p>
                  <Value
                    {...{
                      size: 'xl',
                      state: 'success',
                      engine,
                      choice,
                      situation: futureSituation,
                      dottedName: 'MPR . accompagnée . montant écrêté',
                    }}
                  />
                </div>
                <div>
                  <p className="fr-callout__text">
                    Il restera donc à votre charge :
                  </p>
                  <Value
                    {...{
                      engine,
                      size: 'xl',
                      state: 'warning',
                      choice,
                      situation: futureSituation,
                      dottedName: 'MPR . accompagnée . reste à charge',
                      addOn: 'TTC',
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </>
    </CalculatorWidget>
  )
}
