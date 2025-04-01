import Value from '@/components/Value'
import { Card } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'
import Image from 'next/image'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import TargetDPETabs from './TargetDPETabs'
import editIcon from '@/public/crayon.svg'
import { Key } from '../explications/ExplicationUI'
import CalculatorWidget from '../CalculatorWidget'

export default function DPEScenario({
  choice,
  oldIndex,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
}) {
  if (choice == null) return null

  const isMobile = window.innerWidth <= 600

  const revenuClasseValue = engine
    .setSituation(situation)
    .evaluate('ménage . revenu . classe').nodeValue

  const isModeste = revenuClasseValue.includes('modeste')
  const bonusSortiePassoire = engine
    .setSituation(situation)
    .evaluate('MPR . accompagnée . bonus').nodeValue

  return (
    <CalculatorWidget isMobile={isMobile}>
      <div>
        <DPEQuickSwitch
          oldIndex={oldIndex}
          situation={situation}
          columnDisplay={true}
        />
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
        <div
          css={`
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          `}
        >
          <div>Budget de travaux de rénovation:</div>
          <div
            css={`
              margin: auto;
              border: 2px solid var(--color);
              width: 100%;
              color: var(--color);
              text-align: center;
              border-radius: 0.3rem;
              padding: 0.7rem;
              box-shadow: var(--shadow-elevation-medium);
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <div
              css={`
                flex-grow: 1;
              `}
            >
              <input
                id="budget-travaux"
                css={`
                  border: none;
                  background: transparent;
                  -webkit-appearance: none;
                  outline: none;
                  color: var(--color);
                  font-size: 110%;
                  max-width: 4rem;
                `}
                autoFocus={false}
                value={situation['projet . travaux']}
                placeholder="mes travaux"
                min="0"
                max="999999"
                onChange={(e) => {
                  const rawValue = e.target.value
                  const startPos = e.target.selectionStart
                  const value = +rawValue === 0 ? 0 : rawValue
                  setSearchParams(
                    encodeSituation({
                      'projet . travaux': value + '*',
                    }),
                    'replace',
                    false,
                  )
                  requestAnimationFrame(() => {
                    const inputBudget =
                      document.querySelector('#budget-travaux')
                    inputBudget.selectionStart = startPos
                    inputBudget.selectionEnd = startPos
                  })
                }}
                step="100"
              />
              <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                € HT
              </span>
            </div>
            <Image
              css={`
                cursor: pointer;
                margin-left: auto;
              `}
              src={editIcon}
              alt="Icône crayon pour éditer"
              onClick={() => document.querySelector('#budget-travaux').focus()}
            />
          </div>
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
                situation: {
                  ...situation,
                  'projet . DPE visé': choice + 1,
                },
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
        <Card
          css={`
            margin: 0.6rem 0;
          `}
        >
          👌 Votre logement est trop performant (A&nbsp;ou&nbsp;B) pour
          bénéficier du parcours accompagné.
        </Card>
      ) : (
        <>
          <div
            css={`
              margin: 1rem 0;
            `}
          >
            🥳 <strong>Bonne nouvelle</strong> : Vous êtes éligible à une aide
            de
            <Value
              {...{
                engine,
                situation,
                dottedName: 'MPR . accompagnée . pourcent dont bonus',
              }}
            />
            {bonusSortiePassoire && (
              <>
                (dont <strong>{bonusSortiePassoire} %</strong> de bonus Sortie
                de passoire)
              </>
            )}
             du coût de vos travaux avec un plafond de
            <Value
              {...{
                engine,
                situation,
                dottedName: 'projet . travaux . plafond',
              }}
            />
            de travaux.
          </div>
          {isModeste && (
            <div
              css={`
                background: #fdf8db;
                padding: 1rem;
                margin: 1rem 0;
              `}
            >
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
              <strong>
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'MPR . accompagnée . pourcentage avance',
                    state: 'prime-black',
                  }}
                />
              </strong>{' '}
              de cette aide peut vous être versée en avance de vos travaux.
            </div>
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
              <div>Vous toucherez un total d'aides de :</div>
              <div
                css={`
                  margin-top: 0.5rem;
                  text-align: center;
                  background: var(--validColor1);
                  color: var(--validColor);
                  padding: 0.5rem;
                `}
              >
                <Value
                  {...{
                    engine,
                    choice,
                    situation: {
                      ...situation,
                      'projet . DPE visé': choice + 1,
                    },
                    dottedName: 'MPR . accompagnée . montant écrêté',
                  }}
                />
              </div>
            </div>
            <div>
              <div>Il restera donc à votre charge :</div>
              <div
                css={`
                  margin-top: 0.5rem;
                  text-align: center;
                  background: var(--warningColor);
                  padding: 0.5rem;
                `}
              >
                <Value
                  {...{
                    engine,
                    choice,
                    situation: {
                      ...situation,
                      'projet . DPE visé': choice + 1,
                    },
                    dottedName: 'MPR . accompagnée . reste à charge',
                  }}
                />{' '}
                TTC.
              </div>
            </div>
          </div>
        </>
      )}
    </CalculatorWidget>
  )
}
