import ResultsBlock from '@/app/simulation/ResultsBlock'
import VisualExplanation from '@/app/VisualExplanation'
import css from './css/convertToJs'
import { encodeSituation } from './publicodes/situationUtils'

export default function MPRSelector({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
  rules,
  engine,
}) {
  const numericalValue = situation[currentQuestion]

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

  return (
    <div
      style={css`
        margin-top: 0.6rem;
        width: 100%;
      `}
    >
      <ResultsBlock
        {...{
          engine,
          rules,
          currentQuestion,
          validatedSituation: situation,
          showIfNull: false,
        }}
      />
    </div>
  )
}
