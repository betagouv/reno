import data from '@/components/dpe/DPE.yaml'
import DPE from './DPE'
import { encodeSituation } from '../publicodes/situationUtils'

export default function DPESelector({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
}) {
  const numericalValue = situation[currentQuestion]

  const isNew = currentQuestion === 'projet . DPE visé' ? numericalValue : null,
    newLetter = numericalValue && data[+numericalValue - 1].lettre,
    oldLetter = isNew && data[+situation['DPE . actuel'] - 1].lettre

  return (
    <DPE
      newLetter={newLetter}
      letter={isNew ? oldLetter : newLetter}
      onClick={(value) => {
        const encodedSituation = encodeSituation(
          {
            ...situation,
            [currentQuestion]: value + 1 + '*',
          },
          false,
          answeredQuestions,
        )
        setSearchParams(encodedSituation, 'replace', false)
      }}
    />
  )
}
