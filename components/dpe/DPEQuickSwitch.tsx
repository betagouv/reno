'use client'

import DPELabel from './DPELabel'
import useSetSearchParams from '../useSetSearchParams'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'

export const getAmpleurDPEChoice = (situation) => {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice
  return choice
}
export default function DPEQuickSwitch({
  possibilities = [0, 1, 2, 3, 4, 5, 6],
  noSuccess,
  situation = {},
  text = 'DPE actuel : ',
  ecartClasse = 1,
  disabled,
}) {
  const setSearchParams = useSetSearchParams()

  return (
    <RadioButtons
      legend={text}
      options={possibilities.map((el, index) => {
        return {
          label: <DPELabel index={el} small={false} />,
          nativeInputProps: {
            value: el + 1,
            checked: el + 1 == situation['DPE . actuel'],
            onChange: (e) => {
              push(['trackEvent', 'Module', 'Interaction', 'DPE actuel'])
              let params = { 'DPE . actuel': e.target.value + '*' }
              if (
                situation['projet . DPE visé'] &&
                situation['projet . DPE visé'] > e.target.value - ecartClasse
              ) {
                params['projet . DPE visé'] = e.target.value - ecartClasse
              }

              setSearchParams(encodeSituation(params), 'replace', false)
            },
          },
        }
      })}
      name={`radio-${encodeDottedName('DPE . actuel')}`}
      disabled={disabled}
      state={!noSuccess && situation['DPE . actuel'] && !disabled && 'success'}
      stateRelatedMessage=""
      orientation="horizontal"
    />
  )
}
