import { FormButtonsWrapper, FormLinkButton } from '@/components/InputUI'

export default function FormButtons({
  currentValue,
  setSearchParams,
  encodeSituation,
  answeredQuestions,
  currentQuestion,
  situation,
}) {
  const showValidation = currentValue != null
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
            true,
            false,
          )}
        >
          Suivant
        </FormLinkButton>
      )}
    </FormButtonsWrapper>
  )
}
