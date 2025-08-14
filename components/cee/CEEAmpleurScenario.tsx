import Value from '@/components/Value'
import Image from 'next/image'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import { encodeSituation } from '../publicodes/situationUtils'
import editIcon from '@/public/crayon.svg'
import TargetDPETabs from '../mpra/TargetDPETabs'
import CalculatorWidget from '../CalculatorWidget'
import useIsMobile from '../useIsMobile'

export default function CEEAmpleurScenario({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
}) {
  const isMobile = useIsMobile()

  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  return (
    <CalculatorWidget isMobile={isMobile}>
      <div>
        <DPEQuickSwitch
          oldIndex={situation['DPE . actuel'] - 1}
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
          <div>Surface du logement:</div>
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
                id="surface"
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
                value={situation['logement . surface']}
                min="0"
                max="9999"
                onChange={(e) => {
                  const rawValue = e.target.value
                  const value = +rawValue === 0 ? undefined : rawValue
                  setSearchParams(
                    encodeSituation({
                      'logement . surface': value + '*',
                    }),
                    'replace',
                    false,
                  )
                }}
                step="100"
              />
              <span>m²</span>
            </div>
            <Image
              css={`
                cursor: pointer;
                margin-left: auto;
              `}
              src={editIcon}
              alt="Icône crayon pour éditer"
              onClick={() => document.querySelector('#surface').focus()}
            />
          </div>
        </div>
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
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
                ...situation,
                'projet . DPE visé': choice + 1,
              },
              dottedName: "CEE . rénovation d'ampleur . montant",
            }}
          />
        </div>
      </div>
    </CalculatorWidget>
  )
}
