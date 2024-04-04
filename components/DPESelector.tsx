import DPE from './DPE2'
import { encodeSituation } from './publicodes/situationUtils'
import data from '@/components/DPE.yaml'
import css from './css/convertToJs'

console.log('DPE data', data)

export default function DPESelector({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
}) {
  const numericalValue = situation[currentQuestion]

  console.log(situation, numericalValue, currentQuestion)

  const doSetSearchParams = (value) => {
    const newSituation = encodeSituation(
      {
        ...situation,
        [currentQuestion]: value,
      },
      false,
      answeredQuestions,
    )
    const url = setSearchParams(newSituation, 'push', false)
  }
  const isNew = currentQuestion === 'projet . DPE visé' ? numericalValue : null,
    newLetter = numericalValue && data[+numericalValue - 1].lettre,
    oldLetter = isNew && data[+situation['DPE . actuel'] - 1].lettre

  return (
    <div
      style={css`
        margin-top: 0.6rem;
      `}
    > 
      <DPE
        newLetter={newLetter}
        letter={isNew ? oldLetter : newLetter}
        onClick={(value) =>
          console.log('setDPE', value) || doSetSearchParams(value + 1)
        }
      />
    </div>
  )
}
