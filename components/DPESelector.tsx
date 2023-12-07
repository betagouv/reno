import Test from '@/app/test/page'
import { DPE } from './DPE'

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

  return (
    <DPE
      value={correspondance[numericalValue]}
      onClick={(value) => setSearchParams()}
    />
  )
}
