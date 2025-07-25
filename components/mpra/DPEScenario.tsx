import Value from '@/components/Value'
import { encodeSituation } from '../publicodes/situationUtils'
import DPEQuickSwitch2 from '../dpe/DPEQuickSwitch2'
import TargetDPETabs from './TargetDPETabs'
import CalculatorWidget from '../CalculatorWidget'
import Input from '@codegouvfr/react-dsfr/Input'

export default function DPEScenario({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
}) {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  const isMobile = window.innerWidth <= 600
  const engineSituation = engine.setSituation(situation)
  const revenuClasseValue = engineSituation.evaluate(
    'ménage . revenu . classe',
  ).nodeValue

  const isModeste = revenuClasseValue.includes('modeste')
  const bonusSortiePassoire = engineSituation.evaluate(
    'MPR . accompagnée . bonus',
  ).nodeValue
  const montantTravaux =
    situation['projet . travaux'] ||
    engineSituation.evaluate('projet . travaux').nodeValue
  const futureSituation = {
    ...situation,
    'projet . DPE visé': choice + 1,
    'projet . travaux': montantTravaux,
  }
  return (
    <CalculatorWidget isMobile={isMobile}>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col">
          <DPEQuickSwitch2
            oldIndex={oldIndex}
            situation={situation}
            columnDisplay={true}
          />
        </div>
        <div className="fr-col">
          <TargetDPETabs
            {...{
              oldIndex,
              setSearchParams,
              answeredQuestions,
              choice,
              engine,
              situation,
              columnDisplay: true,
            }}
          />
        </div>
        <div
          className="fr-col"
          css={`
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          `}
        >
          <Input
            label="Budget de travaux de rénovation :"
            nativeInputProps={{
              autoFocus: false,
              value: montantTravaux,
              onChange: (e) => {
                const rawValue = e.target.value
                const value = +rawValue === 0 ? 0 : rawValue
                setSearchParams(
                  encodeSituation({
                    'projet . travaux': value + '*',
                  }),
                  'replace',
                  false,
                )
              },
              min: '0',
              max: '999999',
              step: '100',
              name: 'budget',
              required: true,
            }}
            addon={
              <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                € HT
              </span>
            }
          />
          <div
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
          </div>
        </div>
      </div>

      {oldIndex < 2 ? (
        <p>
          👌 Votre logement est trop performant (A&nbsp;ou&nbsp;B) pour
          bénéficier du parcours accompagné.
        </p>
      ) : (
        <>
          <h2 className="fr-callout__title">🥳 Résultats</h2>
          <div className="fr-callout__text">
            Vous êtes éligible à une aide de{' '}
            <Value
              {...{
                size: 'xl',
                state: 'success',
                engine,
                situation: futureSituation,
                dottedName: 'MPR . accompagnée . pourcent dont bonus',
              }}
            />{' '}
            du coût de vos travaux{' '}
            <span className="fr-hint-text">
              {bonusSortiePassoire && (
                <>
                  dont <strong>{bonusSortiePassoire} %</strong> de bonus "Sortie
                  de passoire"{' '}
                </>
              )}
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
          </div>
        </>
      )}
    </CalculatorWidget>
  )
}
