import FormButtons from '@/app/simulation/FormButtons'
import Suggestions from '@/app/simulation/Suggestions'
import Notifications from './Notifications'
import { encodeSituation } from './publicodes/situationUtils'
import Answers from '@/app/simulation/Answers'
import { useSearchParams } from 'next/navigation'
import AvertissementSimulation, {
  useAvertissementState,
} from './AvertissementSimulation'
import CopyButton from './CopyButton'
import QuestionDescription from './QuestionDescription'
import UserProblemBanner from './UserProblemBanner'
import AmpleurModuleBanner from './ampleur/AmpleurModuleBanner'
import { getRuleName } from './publicodes/utils'
import Script from 'next/script'

export const QuestionText = ({
  rule,
  question: dottedName,
  situation,
  engine,
}) => {
  const ruleName = getRuleName(dottedName)

  const text = rule.question.texte
    ? engine.setSituation(situation).evaluate(rule.question).nodeValue
    : rule.question || rule.titre || ruleName
  return (
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
}

export default function ClassicQuestionWrapper({
  form,
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
  customButtons,
}) {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const { depuisModule } = searchParams
  const remaining = nextQuestions.length

  const [avertissementState, setAvertissementState] = useAvertissementState()

  const tallyForm = currentQuestion === 'projet . définition' ? 'mKjKNk' : null

  return (
    <>
      <AvertissementSimulation
        {...{ avertissementState, setAvertissementState }}
      />
      <div>
        {form != 'copropriété' && (
          <>
            <CopyButton
              customCss={{
                float: 'right',
              }}
              searchParams={searchParams}
            />
            <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
              <h1 className="fr-stepper__title">
                {currentQuestion.startsWith('projet')
                  ? 'Mon projet'
                  : 'Ma situation'}
                <span className="fr-stepper__state">
                  Étape {currentQuestion.startsWith('projet') ? 2 : 1} sur 4
                </span>
              </h1>
              <div
                className="fr-stepper__steps"
                data-fr-current-step={
                  currentQuestion.startsWith('projet') ? 2 : 1
                }
                data-fr-steps="4"
              ></div>
              <p className="fr-stepper__details">
                <span className="fr-text--bold">Étape suivante :</span>{' '}
                {currentQuestion.startsWith('projet')
                  ? 'Mes aides'
                  : 'Mon projet'}
              </p>
            </div>
          </>
        )}
      </div>
      {form == 'copropriété' && (
        <CopyButton
          customCss={{
            alignItems: 'flex-end',
            marginTop: '1rem',
          }}
          searchParams={searchParams}
        />
      )}
      <AmpleurModuleBanner
        {...{
          depuisModule,
          setSearchParams,
          situation,
          remaining,
        }}
      />
      {tallyForm && (
        <>
          <Script src="https://tally.so/widgets/embed.js"></Script>{' '}
          <Script
            id={tallyForm}
          >{` window.TallyConfig = { "formId": "${tallyForm}", "popup": { "emoji": { "text": "👋", "animation": "wave" }, "open": { "trigger": "exit" } } }; `}</Script>
        </>
      )}
      <form id="simulator-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset
          className="fr-fieldset"
          form="simulator-form"
          aria-labelledby="simulator-form-legend simulator-form-messages"
        >
          {!rule.type && (
            <QuestionText
              {...{
                rule,
                question: currentQuestion,
                rules,
                situation,
                engine,
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
        {noButtons ? (
          customButtons
        ) : (
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
          margin-top: 8vh;
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
      </section>
    </>
  )
}
