import dpeValues from '@/components/dpe/DPE.yaml'
import DPELabel from '../dpe/DPELabel'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'

export default function TargetDPETabs({
  oldIndex,
  setSearchParams,
  answeredQuestions,
  choice,
  situation,
  disabled,
  text = 'DPE visé',
  columnDisplay,
}) {
  const possibilities = dpeValues.filter((el, index) => index <= oldIndex - 2)

  const doSetSearchParams = (value) => {
    push(['trackEvent', 'Module', 'Interaction', 'DPE visé ' + value])
    setSearchParams(
      encodeSituation({
        'projet . DPE visé': value + '*',
      }),
      'replace',
      false,
    )
  }
  return (
    <RadioButtons
      legend={text}
      options={possibilities.map((el, index) => {
        return {
          label: <DPELabel index={index} small={false} />,
          nativeInputProps: {
            value: index,
            checked: index === choice,
            onChange: () => doSetSearchParams(index + 1),
          },
        }
      })}
      name={`radio-${encodeDottedName('projet . DPE visé')}`}
      disabled={disabled}
      state={situation['projet . DPE visé'] && !disabled && 'success'}
      stateRelatedMessage=""
    />
  )
}
