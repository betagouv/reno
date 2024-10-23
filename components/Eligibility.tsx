import { No, Yes } from '@/components/ResultUI'
import { useMemo } from 'react'
import AmpleurSummary from './ampleur/AmpleurSummary'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import PersonaBar from './PersonaBar'
import { Avis } from './explications/Éligibilité'
import { encodeDottedName } from './publicodes/situationUtils'
import ÀlaCarteSummary from './ÀlaCarteSummary'
import Answers from '@/app/simulation/Answers'
import { useIsCompact } from './useIsInIframe'
import Feedback from '@/app/contact/Feedback'
import FatConseiller from './FatConseiller'
import BackToLastQuestion from './BackToLastQuestion'

export default function Eligibility({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  nextQuestions,
  currentQuestion,
  expanded,
  searchParams,
}) {
  const isCompact = useIsCompact()
  const nextLink = (value) => {
    const url = setSearchParams(
      {
        [encodeDottedName("parcours d'aide")]: `"${encodeDottedName(value)}"*`,
      },
      'url',
      false,
    )
    return url
  }

  const [mpraEvaluation, mprgEvaluation, ceeConditionsEvaluation] =
      useMemo(() => {
        const newEngine = engine.setSituation(situation)
        return [
          newEngine.evaluate('MPR . accompagnée . éligible'),
          newEngine.evaluate('MPR . non accompagnée . éligible'),
          newEngine.evaluate('CEE . conditions'),
        ]
      }, [situation, engine]),
    mpra = mpraEvaluation.nodeValue,
    mprg = mprgEvaluation.nodeValue,
    ceeConditions = ceeConditionsEvaluation.nodeValue
  const both = mpra && mprg,
    noMpr = !mpra && !mprg,
    some = mpra || mprg || ceeConditions

  const showPersonaBar = searchParams.personas != null

  return (
    <section
      css={`
        ${showPersonaBar && `margin-top: 4rem`}
      `}
    >
      <PersonaBar
        startShown={showPersonaBar}
        selectedPersona={searchParams.persona}
        engine={engine}
      />
      <CustomQuestionWrapper>
        {isCompact && (
          <Answers
            {...{
              answeredQuestions,
              nextQuestions,
              currentQuestion,
              rules,
              situation,
            }}
          />
        )}
        <BackToLastQuestion
          {...{ setSearchParams, situation, answeredQuestions }}
        />
        <header>
          <small>Eligibilité</small>
          <h2
            css={`
              font-size: 120%;
              margin: 0.5rem 0 !important;
            `}
          >
            {some && <>Bonne nouvelle 🥳</>}
          </h2>
        </header>
        {noMpr && !ceeConditions && (
          <p>
            Nous n'avons <No>pas trouvé d'aide</No> à laquelle vous êtes
            éligible.
          </p>
        )}
        {some && (
          <p>
            <Yes>Vous êtes éligible</Yes> aux aides présentées ci-dessous
          </p>
        )}
        <Avis {...{ situation, engine }} />
        <div
          css={`
            display: flex;
            flex-wrap: nowrap;
            > div:nth-child(1),
            > div:nth-child(3) {
              width: 45%;
            }
            @media (max-width: 700px) {
              flex-wrap: wrap;
              flex-direction: column;
              > div {
                width: 100% !important;
              }
            }
            justify-content: center;
          `}
        >
          <AmpleurSummary
            id="parcours-ampleur"
            {...{
              engine,
              url: nextLink('ampleur'),
              situation,
              expanded,
              setSearchParams,
            }}
          />
          <div
            css={`
              padding: 0 1rem;
              align-self: center;
            `}
          >
            <strong
              css={`
                display: block;
                text-align: center;
                margin: 1rem auto;
                font-size: 130%;
              `}
            >
              ou
            </strong>
          </div>
          <ÀlaCarteSummary
            id="parcours-gestes"
            {...{
              engine,
              rules,
              url: nextLink('à la carte'),
              situation,
            }}
          />
        </div>
        <div>
          <FatConseiller
            {...{
              situation,
              margin: 'small',
              titre:
                'Vous ne savez pas quel parcours choisir pour votre projet ?',
              texte:
                "Un conseiller France Rénov' peut répondre à vos questions et vous guider dans votre choix. C'est 100% gratuit !",
            }}
          />
        </div>
        <Feedback title="Avez-vous bien compris les deux parcours d'éligibilité ?" />
      </CustomQuestionWrapper>
    </section>
  )
}
