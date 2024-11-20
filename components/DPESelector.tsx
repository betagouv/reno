import DPE from './DPE2'
import { encodeSituation } from './publicodes/situationUtils'
import data from '@/components/DPE.yaml'
import css from './css/convertToJs'

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
            [currentQuestion]: value + 1,
          },
          false,
          answeredQuestions,
        )
        setSearchParams(encodedSituation, 'replace', false)
      }}
    />
  )
}
