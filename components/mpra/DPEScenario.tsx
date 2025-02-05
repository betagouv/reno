import Value from '@/components/Value'
import DPELabel from '../DPELabel'
import calculatorIcon from '@/public/calculator-black.svg'
import Input from '../Input'
import { Card } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'
import Image from 'next/image'
import DPEQuickSwitch from '../DPEQuickSwitch'
import TargetDPETabs from './TargetDPETabs'

export default function DPEScenario({
  choice,
  oldIndex,
  engine,
  situation,
  setSearchParams,
  exampleSituation,
  answeredQuestions,
}) {
  if (choice == null) return null
  const revenuClasseValue = engine
    .setSituation(situation)
    .evaluate('ménage . revenu . classe').nodeValue

  const isModeste = revenuClasseValue.includes('modeste')

  return (
    <Card
      css={`
        background: linear-gradient(180deg, #f7f7f7 0%, #e6f7fb 100%);
        box-shadow: 1px 4px 6px 0px #ccd0d5;
        margin-bottom: 1rem;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          h3 {
            margin: 0.5rem 0;
          }
        `}
      >
        <Image src={calculatorIcon} alt="icone calculatrice" />{' '}
        <h3>À vos calculs !</h3>
      </div>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        `}
      >
        <DPEQuickSwitch oldIndex={oldIndex} situation={situation} />
        <TargetDPETabs
          {...{
            oldIndex,
            setSearchParams,
            answeredQuestions,
            choice,
            engine,
            situation,
          }}
        />
        <div css={'display: flex; flex-direction: column;gap: 0.5rem;'}>
          <div>Votre budget de travaux de rénovation:</div>
          <label
            css={`
              margin: auto;
              border: 2px solid var(--color);
              width: 100%;
              color: var(--color);
              text-align: center;
              border-radius: 0.3rem;
              padding: 0.7rem;
              box-shadow: var(--shadow-elevation-medium);
            `}
          >
            <input
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
              value={exampleSituation['projet . travaux']}
              placeholder="mes travaux"
              min="0"
              max="999999"
              onChange={(e) => {
                const rawValue = e.target.value
                const value = +rawValue === 0 ? undefined : rawValue
                setSearchParams(
                  encodeSituation({
                    'projet . travaux': value,
                  }),
                  'replace',
                  false,
                )
              }}
              step="100"
            />

            <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
              € HT
            </span>
          </label>
          <div
            css={`
              text-align: center;
            `}
          >
            soit
            <Value
              {...{
                engine,
                choice,
                situation: {
                  ...exampleSituation,
                  'projet . DPE visé': choice + 1,
                },
                dottedName: 'projet . travaux . TTC',
              }}
            />
            <span title="En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
              {' '}
              TTC
            </span>
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
                dottedName: 'MPR . accompagnée . pourcent brut',
              }}
            />
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
            `}
          >
            <div
              css={`
                display: flex;
                flex-direction: column;
              `}
            >
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
                      ...exampleSituation,
                      'projet . DPE visé': choice + 1,
                    },
                    dottedName: 'MPR . accompagnée . montant écrêté',
                  }}
                />
              </div>
            </div>
            <div
              css={`
                display: flex;
                flex-direction: column;
              `}
            >
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
                      ...exampleSituation,
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
    </Card>
  )
}
