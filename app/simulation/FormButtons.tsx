import { CTA, CTAWrapper } from '@/components/UI'
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
  depuisModule,
  specificNextUrl,
  specificBackUrl,
  setAvertissementState,
}) {
  const showValidation = currentValue != null
  return (
    <CTAWrapper $justify="flex-start">
      <CTA
        $fontSize="normal"
        $importance="emptyBackground"
        title="Retour en arrière"
      >
        <Link
          css={`
            display: flex !important;
            align-items: center !important;
          `}
          href={
            specificBackUrl
              ? specificBackUrl
              : setSearchParams(
                  {
                    ...encodeSituation(
                      situation,
                      false,
                      answeredQuestions.slice(0, -1),
                    ),
                  },
                  'url',
                  true,
                )
          }
          onClick={() => {
            if (depuisModule) history.back() // retour direct vers le module passoire au sein de l'iframe, pas vers une question précédente que l'utilisateur n'aurait pas renseignée tout seul
            push([
              'trackEvent',
              'Simulateur Principal',
              'Précédent',
              currentQuestion,
            ])
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
        </Link>
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
            href={
              specificNextUrl
                ? specificNextUrl
                : setSearchParams(
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
                      objectif: undefined,
                    },
                    'url',
                    false,
                  )
            }
            onClick={() => {
              push([
                'trackEvent',
                'Simulateur Principal',
                currentQuestion,
                situation[currentQuestion],
              ])
              push([
                'trackEvent',
                'Simulateur Principal',
                'Valide',
                currentQuestion,
              ])
              setAvertissementState(false)
            }}
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
