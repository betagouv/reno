import FormButtons from '@/app/simulation/FormButtons'
import { QuestionHeader } from '@/app/simulation/QuestionHeader'
import Suggestions from '@/app/simulation/Suggestions'
import { AnswerWrapper } from './InputUI'
import Notifications from './Notifications'
import { encodeSituation } from './publicodes/situationUtils'

import Answers, { categoryData } from '@/app/simulation/Answers'
import ProgressBar from '@/app/simulation/ProgressBar'
import Share from '@/app/simulation/Share'
import { useSearchParams } from 'next/navigation'
import { isMosaicQuestion } from './BooleanMosaic'
import { gestesMosaicQuestionText } from './GestesMosaic'
import QuestionDescription from './QuestionDescription'
import UserProblemBanner from './UserProblemBanner'
import AmpleurModuleBanner from './ampleur/AmpleurModuleBanner'
import { getRuleName } from './publicodes/utils'
import CopyButton from './CopyButton'

export const QuestionText = ({
  rule,
  question: dottedName,
  rules,
  situation,
  engine,
}) => {
  if (isMosaicQuestion(dottedName, rule, rules))
    return gestesMosaicQuestionText(rules, dottedName)
  const ruleName = getRuleName(dottedName)

  const text = rule.question.texte
    ? engine.setSituation(situation).evaluate(rule.question).nodeValue
    : rule.question || rule.titre || ruleName
  return <h1>{text.replace(/\s\?/, '')}&nbsp;?</h1>
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
  const remaining =
    nextQuestions.indexOf("parcours d'aide") !== -1
      ? nextQuestions.indexOf("parcours d'aide")
      : nextQuestions.length

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
      <AmpleurModuleBanner
        {...{
          depuisModule,
          setSearchParams,
          situation,
          remaining,
        }}
      />
      <div
        css={`
          max-width: 800px;
          min-height: 100%;
          padding: 0 1rem;
          margin: 0 auto;
        `}
      >
        {!rule.type && (
          <QuestionHeader>
            <div>
              <small>{categoryTitle}</small>
              <QuestionText
                {...{
                  rule,
                  question: currentQuestion,
                  rules,
                  situation,
                  engine,
                }}
              />
              {rule['sous-titre'] && (
                <div
                  css={`
                    p {
                      color: #666;
                      font-size: 90%;
                      line-height: 1.25rem;
                    }
                  `}
                  dangerouslySetInnerHTML={{ __html: rule.sousTitreHtml }}
                ></div>
              )}
            </div>
            <div>
              <CopyButton searchParams={searchParams} />
            </div>
          </QuestionHeader>
        )}
        <AnswerWrapper>
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
        </AnswerWrapper>
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
          }}
        />
        <Notifications {...{ currentQuestion, engine }} />
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
        <br />
        <UserProblemBanner />
      </div>
    </>
  )
}
