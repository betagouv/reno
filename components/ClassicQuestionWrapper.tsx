import FormButtons from '@/app/simulation/FormButtons'
import Suggestions from '@/app/simulation/Suggestions'
import Notifications from './Notifications'
import { encodeSituation } from './publicodes/situationUtils'
import Answers, { categoryData } from '@/app/simulation/Answers'
import { useSearchParams } from 'next/navigation'
import AvertissementSimulation, {
  useAvertissementState,
} from './AvertissementSimulation'
import CopyButton from './CopyButton'
import QuestionDescription from './QuestionDescription'
import UserProblemBanner from './UserProblemBanner'
import AmpleurModuleBanner from './ampleur/AmpleurModuleBanner'
import { getRuleName } from './publicodes/utils'
import { Stepper } from '@codegouvfr/react-dsfr/Stepper'
import Tag from '@codegouvfr/react-dsfr/Tag'

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
  const { categoryTitle } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules,
  )
  const remaining = nextQuestions.length

  const [avertissementState, setAvertissementState] = useAvertissementState()

  return (
    <>
      <div>
        {form != 'copropriété' && (
          <>
            <CopyButton
              customCss={{
                float: 'right',
              }}
              searchParams={searchParams}
            />
            <Stepper
              className="fr-mt-5v"
              currentStep={currentQuestion.startsWith('projet') ? 2 : 1}
              nextTitle={
                currentQuestion.startsWith('projet')
                  ? 'Eligibilité'
                  : 'Votre projet'
              }
              stepCount={4}
              title={
                currentQuestion.startsWith('projet')
                  ? 'Votre projet'
                  : 'Votre situation'
              }
            />
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
      <AvertissementSimulation
        {...{ avertissementState, setAvertissementState }}
      />
      <AmpleurModuleBanner
        {...{
          depuisModule,
          setSearchParams,
          situation,
          remaining,
        }}
      />
      {categoryTitle && <Tag>{categoryTitle}</Tag>}
      <form id="simulator-form">
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
          {suggestions && (
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
          )}
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
