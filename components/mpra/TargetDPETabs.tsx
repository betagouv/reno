import dpeValues from '@/components/dpe/DPE.yaml'
import DPELabel from '../dpe/DPELabel'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'

export default function TargetDPETabs({
  setSearchParams,
  situation,
  disabled,
  ecartClasse = 1,
  text = 'DPE visé :',
  noSuccess = false,
}) {
  const possibilities = dpeValues.filter(
    (el, index) => index + 1 <= situation['DPE . actuel'] - ecartClasse,
  )

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
            value: index + 1,
            checked: index + 1 == situation['projet . DPE visé'],
            onChange: () => doSetSearchParams(index + 1),
          },
        }
      })}
      name={`radio-${encodeDottedName('projet . DPE visé')}`}
      disabled={disabled}
      state={
        !noSuccess && situation['projet . DPE visé'] && !disabled && 'success'
      }
      orientation="horizontal"
      stateRelatedMessage=""
    />
  )
}
