import setIframeFullscreen, {
  isInFullscreen,
  useIsFullscreen,
} from '@/components/setIframeFullscreen'
import useIsInIframe from '@/components/useIsInIframe'
import { Button } from '@codegouvfr/react-dsfr/Button'
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
  setAvertissementState = null,
}) {
  const showValidation = currentValue != null

  const isIframe = useIsInIframe()

  const isFullscreen = useIsFullscreen()

  return (
    <div
      css={`
        display: flex;
        gap: 1em;
        margin-top: 1em;
        @media (height <= 1000px) {
          position: fixed;
          bottom: 0;
          left: 0;
          padding: 1rem 1rem 1rem;
          background: white;
          filter: drop-shadow(var(--raised-shadow));
          width: 100%;
          z-index: 1000;
        }
      `}
    >
      <Button
        iconId="fr-icon-arrow-left-fill"
        priority="secondary"
        linkProps={{
          href: specificBackUrl
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
              ),
        }}
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
        Précédent
      </Button>
      {showValidation ? (
        <Button
          title="Aller à l'étape suivante"
          iconPosition="right"
          iconId="fr-icon-arrow-right-fill"
          linkProps={{
            href: specificNextUrl
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
                ),
          }}
        >
          Suivant
        </Button>
      ) : (
        <Button
          disabled={!showValidation}
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
            typeof setAvertissementState === 'function' &&
              setAvertissementState(false)
          }}
          iconPosition="right"
          iconId="fr-icon-arrow-right-fill"
          title="Répondez à la question pour avancer dans le questionnaire"
        >
          {' '}
          Suivant
        </Button>
      )}
      {isIframe && (
        <button
          onClick={setIframeFullscreen}
          css={`
            height: 2.2rem;
            img {
              margin: 0.5rem 0;
              width: 1.6rem;
              height: auto;
            }
          `}
        >
          <img
            src={
              !isFullscreen
                ? '/fullscreen-line.svg'
                : '/fullscreen-exit-line.svg'
            }
            width="10"
            height="10"
            alt="Icône plein écran"
          />
        </button>
      )}
    </div>
  )
}
