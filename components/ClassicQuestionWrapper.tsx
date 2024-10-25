import FormButtons from '@/app/simulation/FormButtons'
import { QuestionHeader } from '@/app/simulation/QuestionHeader'
import Suggestions from '@/app/simulation/Suggestions'
import { AnswerWrapper } from './InputUI'
import Notifications from './Notifications'
import { encodeSituation } from './publicodes/situationUtils'

import { isMosaicQuestion } from './BooleanMosaic'
import { gestesMosaicQuestionText } from './GestesMosaic'
import QuestionDescription from './QuestionDescription'
import { Card } from './UI'
import { getRuleName } from './publicodes/utils'
import Answers, { categoryData } from '@/app/simulation/Answers'
import useIsInIframe, { useIsCompact } from './useIsInIframe'
import UserProblemBanner from './UserProblemBanner'
import Share from '@/app/simulation/Share'
import { useSearchParams } from 'next/navigation'

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
  if (text.endsWith(' ?'))
    return <span>{text.replace(/\s\?$/, '')}&nbsp;?</span>
  return <span>{text}</span>
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
  const isInIframe = useIsInIframe()
  const isCompact = useIsCompact()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const { categoryTitle } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules,
  )
  return (
    <div
      css={`
        clear: both;
      `}
    >
      {(!rule.type || !rule.type === 'question rhétorique') && (
        <QuestionHeader>
          <small>{categoryTitle}</small>
          <h3>
            <QuestionText
              {...{
                rule,
                question: currentQuestion,
                rules,
                situation,
                engine,
              }}
            />
          </h3>
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
        }}
      />
      <QuestionDescription {...{ currentQuestion, rule }} />
      <Answers
        {...{
          answeredQuestions,
          nextQuestions,
          currentQuestion,
          rules,
          situation,
        }}
      />
      <Notifications {...{ currentQuestion, engine }} />
      {!isInIframe && (
        <>
          <br />
          <UserProblemBanner />
          <Share searchParams={searchParams} />
        </>
      )}
    </div>
  )
}
