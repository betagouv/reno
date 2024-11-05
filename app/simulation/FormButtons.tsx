import { isMosaicQuestion } from '@/components/BooleanMosaic'
import { CTA, CTAWrapper } from '@/components/UI'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import iconFlecheGauche from '@/public/fleche-gauche.svg'
import iconFlecheDroite from '@/public/fleche-droite.svg'
import iconFlecheDroiteBlanc from '@/public/fleche-droite-blanc.svg'
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
    <CTAWrapper $justify="flex-start">
      <CTA
        $fontSize="normal"
        $importance="emptyBackground"
        title="Retour en arrière"
      >
        <span
          css={`
            display: flex !important;
            align-items: center !important;
          `}
          onClick={() => {
            push([
              'trackEvent',
              'Simulateur Principal',
              'Précédent',
              currentQuestion,
            ])
            router.back()
          }}
        >
          <Image
            css={`
              margin-right: 0.5rem;
            `}
            src={iconFlecheGauche}
            alt="icone fleche fauche"
          />
          Précédent
        </span>
      </CTA>
      <CTA
        $fontSize="normal"
        $importance={showValidation ? 'primary' : 'inactive'}
      >
        {showValidation ? (
          <Link
            css={`
              display: flex !important;
              align-items: center !important;
            `}
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
            onClick={() =>
              push([
                'trackEvent',
                'Simulateur Principal',
                'Valide',
                currentQuestion,
              ])
            }
            title="Aller à l'étape suivante"
          >
            Suivant
            <Image
              css={`
                margin-left: 0.5rem;
              `}
              src={iconFlecheDroiteBlanc}
              alt="icone fleche droite"
            />
          </Link>
        ) : (
          <span
            css={`
              display: flex !important;
              align-items: center !important;
            `}
            title="Répondez à la question pour avancer dans le questionnaire"
          >
            Suivant
            <Image
              css={`
                margin-left: 0.5rem;
              `}
              src={iconFlecheDroite}
              alt="icone fleche droite"
            />
          </span>
        )}
      </CTA>
    </CTAWrapper>
  )
}
