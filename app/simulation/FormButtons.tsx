import { isMosaicQuestion } from '@/components/BooleanMosaic'
import { CTA, CTAWrapper } from '@/components/UI'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FormButtons({
  currentValue,
  setSearchParams,
  encodeSituation,
  answeredQuestions,
  currentQuestion,
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
        <button onClick={() => router.back()}>←</button>
      </CTA>
      {showValidation && (
        <CTA>
          <Link
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
            title="Aller à l'étape suivante"
          >
            Suivant
          </Link>
        </CTA>
      )}
    </CTAWrapper>
  )
}
