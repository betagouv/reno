import { isMosaicQuestion } from '@/components/BooleanMosaic'
import { CTA, CTAWrapper } from '@/components/UI'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { push } from '@socialgouv/matomo-next'

export default function FormButtons({
  currentValue,
  setSearchParams,
  encodeSituation,
  answeredQuestions,
  currentQuestion,
  questionsToSubmit,
  situation,
  rules,
}) {
  const router = useRouter()
  const mosaicQuestions = isMosaicQuestion(
    currentQuestion,
    rules[currentQuestion],
    rules,
  )

  const showValidation =
    currentValue != null ||
    (mosaicQuestions && mosaicQuestions.find(([q]) => situation[q] != null))

  return (
    <CTAWrapper>
      <CTA $importance="secondary" title="Retour en arrière">
        <button onClick={() => {
          push(["trackEvent", "Simulateur Principal", "Précédent", currentQuestion]);
          router.back()
        }}>←</button>
      </CTA>
      <CTA $importance={showValidation ? 'primary' : 'inactive'}>
        {showValidation ? (
          <Link
            href={setSearchParams(
              {
                ...encodeSituation(
                  {
                    ...situation,
                    [currentQuestion]: situation[currentQuestion],
                  },
                  false,
                  [...answeredQuestions, ...questionsToSubmit],
                ),
                question: undefined,
              },
              'url',
              false,
            )}
            onClick={() => push(["trackEvent", "Simulateur Principal", "Valide", currentQuestion]) }
            title="Aller à l'étape suivante"
          >
            Suivant
          </Link>
        ) : (
          <span title="Répondez à la question pour avancer dans le questionnaire">
            Suivant
          </span>
        )}
      </CTA>
    </CTAWrapper>
  )
}
