import Test from '@/app/test/page'
import { DPE } from './DPE'
import { encodeSituation } from './publicodes/situationUtils'

const correspondance = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'F',
  7: 'G',
}
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
    console.log('newS', newSituation)
    const url = setSearchParams(newSituation, false, false)
    console.log('newU', url)
  }
  return (
    <DPE
      value={correspondance[numericalValue]}
      onClick={(value) =>
        console.log('setDPE', value) || doSetSearchParams(value)
      }
    />
  )
}
