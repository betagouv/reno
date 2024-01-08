import DPE from './DPE2'
import { encodeSituation } from './publicodes/situationUtils'
import data from '@/components/DPE.yaml'

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
    const url = setSearchParams(newSituation, false, false)
  }
  const isNew = currentQuestion === 'DPE . visé' ? numericalValue : null,
    newLetter = numericalValue && data[+numericalValue].lettre,
    oldLetter = isNew && data[+situation['DPE . actuel']].lettre

  return (
    <DPE
      newLetter={newLetter}
      letter={isNew ? oldLetter : newLetter}
      onClick={(value) =>
        console.log('setDPE', value) || doSetSearchParams(value)
      }
    />
  )
}
