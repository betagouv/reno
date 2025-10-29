import Answers from '@/app/simulation/Answers'
import FormButtons from '@/app/simulation/FormButtons'
import { useSearchParams } from 'next/navigation'
import AvertissementSimulation, {
  useAvertissementState,
} from './AvertissementSimulation'
import CopyButton from './CopyButton'
import Notifications from './Notifications'
import QuestionDescription from './QuestionDescription'
import UserProblemBanner from './UserProblemBanner'
import AmpleurModuleBanner from './ampleur/AmpleurModuleBanner'
import { encodeSituation } from './publicodes/situationUtils'
import { getRuleName } from './publicodes/utils'
import { SharePage } from './Eligibility'

export const QuestionText = ({
  rule,
  question: dottedName,
  situation,
  engine,
  noLabel = false, // Parfois on veut un vrai élément label (déjà inclus via <Input label={...} ,ex: AddressSearch et logement . surface ) et pas un legend
}) => {
  const ruleName = getRuleName(dottedName)

  const text = rule.question.texte
    ? engine.setSituation(situation).evaluate(rule.question).nodeValue
    : rule.question || rule.titre || ruleName
  return (
    !noLabel && (
      <legend className="fr-fieldset__legend--bold fr-fieldset__legend fr-text--lead fr-pb-0">
        {text.replace(/\s\?/, '')}&nbsp;?
        {rule['sous-titre'] && (
          <div
            className="fr-hint-text"
            dangerouslySetInnerHTML={{ __html: rule.sousTitreHtml }}
          />
        )}
      </legend>
    )
  )
}

export default function ClassicQuestionWrapper({
  form,
  nbStep,
  children,
  rule,
  currentQuestion,
  rules,
  answeredQuestions,
  situation,
  setSearchParams,
  questionsToSubmit = [currentQuestion],
  currentValue,
  engine,
  suggestions,
  nextQuestions,
  noButtons = false,
  noLabel = false,
}) {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const { depuisModule } = searchParams

  const [avertissementState, setAvertissementState] = useAvertissementState()

  return (
    <>
      <AvertissementSimulation
        {...{ avertissementState, setAvertissementState }}
      />
      <div>
        {form != 'copropriété' && (
          <>
            <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
              <h1 className="fr-stepper__title">
                {currentQuestion.startsWith('projet')
                  ? 'Mon projet'
                  : 'Ma situation'}
                <span className="fr-stepper__state">
                  Étape {currentQuestion.startsWith('projet') ? 2 : 1} sur{' '}
                  {nbStep}
                </span>
              </h1>
              <div
                className="fr-stepper__steps"
                data-fr-current-step={
                  currentQuestion.startsWith('projet') ? 2 : 1
                }
                data-fr-steps={nbStep}
              ></div>
              <p className="fr-stepper__details">
                <span className="fr-text--bold">Étape suivante :</span>{' '}
                {currentQuestion.startsWith('projet') || nbStep == 3
                  ? 'Mes aides'
                  : 'Mon projet'}
              </p>
            </div>
          </>
        )}
      </div>
      <AmpleurModuleBanner
        {...{
          depuisModule,
          situation,
        }}
      />
      <form id="simulator-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset
          className="fr-fieldset"
          form="simulator-form"
          aria-labelledby="simulator-form-legend simulator-form-messages"
          css={`
            .fr-input-group > label.fr-label {
              font-weight: 700;
              width: 100%;
              color: var(--text-label-grey);
              font-size: 1.25rem !important;
              line-height: 2rem !important;
              margin: var(--text-spacing);
            }
          `}
        >
          {!rule.type && (
            <QuestionText
              {...{
                rule,
                question: currentQuestion,
                rules,
                situation,
                engine,
                noLabel,
              }}
            />
          )}
          {/* {suggestions && (
            <Suggestions
              rule={rule}
              onClick={(value) => {
                setSearchParams(
                  encodeSituation(
                    {
                      ...situation,
                      [currentQuestion]: value,
                    },
                    false,
                    answeredQuestions,
                  ),
                  'replace',
                  false,
                )
              }}
            />
          )} */}
          {children}
        </fieldset>
        {!noButtons && (
          <FormButtons
            {...{
              currentValue,
              rules,
              setSearchParams,
              encodeSituation,
              answeredQuestions,
              questionsToSubmit,
              currentQuestion,
              situation,
              depuisModule,
              setAvertissementState,
            }}
          />
        )}
      </form>
      <Notifications {...{ currentQuestion, engine }} />
      <section
        css={`
          margin-top: 10vh;
        `}
      >
        <QuestionDescription {...{ currentQuestion, rule }} />
        <Answers
          {...{
            answeredQuestions,
            nextQuestions,
            currentQuestion,
            rules,
            engine,
            situation,
          }}
        />
        <UserProblemBanner />
        <SharePage />
      </section>
    </>
  )
}
