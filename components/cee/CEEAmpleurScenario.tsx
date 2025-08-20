import Value from '@/components/Value'
import { encodeSituation } from '../publicodes/situationUtils'
import TargetDPETabs from '../mpra/TargetDPETabs'
import CalculatorWidget from '../CalculatorWidget'
import useIsMobile from '../useIsMobile'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import Input from '@codegouvfr/react-dsfr/Input'

export default function CEEAmpleurScenario({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
}) {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value) : automaticChoice

  return (
    <CalculatorWidget>
      <div>
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
            label="Surface du logement :"
            nativeInputProps={{
              type: 'number',
              autoFocus: false,
              value: situation['logement . surface'],
              onChange: (e) => {
                const rawValue = e.target.value
                const value = +rawValue === 0 ? undefined : rawValue
                setSearchParams(
                  encodeSituation({
                    'logement . surface': value + '*',
                  }),
                  'replace',
                  false,
                )
              },
              min: '0',
              max: '9999',
              step: '1',
              required: true,
            }}
            addon={<>m²</>}
          />
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
        <div>
          <Value
            {...{
              size: 'xl',
              engine,
              choice,
              state: 'success',
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
