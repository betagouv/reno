import FormButtons from '@/app/simulation/FormButtons'
import Suggestions from '@/app/simulation/Suggestions'
import Notifications from './Notifications'
import { encodeSituation } from './publicodes/situationUtils'
import Answers, { categoryData } from '@/app/simulation/Answers'
import ProgressBar from '@/app/simulation/ProgressBar'
import { useSearchParams } from 'next/navigation'
import AvertissementSimulation, {
  useAvertissementState,
} from './AvertissementSimulation'
import CopyButton from './CopyButton'
import QuestionDescription from './QuestionDescription'
import UserProblemBanner from './UserProblemBanner'
import AmpleurModuleBanner from './ampleur/AmpleurModuleBanner'
import { getRuleName } from './publicodes/utils'
import { Content } from './explications/ExplicationUI'

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
  noSuggestions,
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
      <ProgressBar
        {...{
          answeredQuestions,
          nextQuestions,
          currentQuestion,
          rules,
          situation,
          searchParams,
        }}
      />
      <Content>
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
        <CopyButton searchParams={searchParams} />
        <h2
          css={`
            color: var(--color);
          `}
          className="fr-text--lg fr-mb-1v"
        >
          {categoryTitle}
        </h2>
        <fieldset
          className="fr-fieldset"
          css={`
            clear: both;
          `}
          id="storybook-form"
          aria-labelledby="storybook-form-legend storybook-form-messages"
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
          {!noSuggestions && (
            <Suggestions
              rule={rule}
              onClick={(value) =>
                setSearchParams(
                  encodeSituation(
                    {
                      ...situation,
                      [currentQuestion]: value,
                    },
                    false,
                    answeredQuestions,
                  ),
                  'url',
                  false,
                )
              }
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
      </Content>
    </>
  )
}
