import { isMosaicQuestion } from '@/components/BooleanMosaic'
import { FormButtonsWrapper, FormLinkButton } from '@/components/InputUI'

export default function FormButtons({
  currentValue,
  setSearchParams,
  encodeSituation,
  answeredQuestions,
  currentQuestion,
  situation,
  rules,
}) {
  const mosaicQuestions = isMosaicQuestion(
    currentQuestion,
    rules[currentQuestion],
    rules,
  )

  const showValidation =
    currentValue != null ||
    (mosaicQuestions && mosaicQuestions.find(([q]) => situation[q] != null))

  return (
    <FormButtonsWrapper>
      {showValidation && (
        <FormLinkButton
          href={setSearchParams(
            encodeSituation(
              {
                ...situation,
                [currentQuestion]: situation[currentQuestion],
              },
              false,
              [...answeredQuestions, currentQuestion],
            ),
            'url',
            false,
          )}
        >
          Suivant
        </FormLinkButton>
      )}
    </FormButtonsWrapper>
  )
}
