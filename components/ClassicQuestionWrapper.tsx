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
import { categoryData } from '@/app/simulation/Answers'

export const getQuestionText = (rule, dottedName, rules) => {
  if (isMosaicQuestion(dottedName, rule, rules))
    return gestesMosaicQuestionText(rules, dottedName)
  const ruleName = getRuleName(dottedName)
  const text = rule.question || rule.titre || ruleName
  return text
}
export default function ClassicQuestionWrapper({
  children,
  rule,
  currentQuestion,
  rules,
  answeredQuestions,
  situation,
  setSearchParams,
  currentValue,
  engine,
  noSuggestions,
  nextQuestions,
}) {
  const { categoryTitle } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules,
  )
  return (
    <div>
      <Card>
        <div>
          {(!rule.type || !rule.type === 'question rhétorique') && (
            <QuestionHeader>
              <small>{categoryTitle}</small>
              <h3>{getQuestionText(rule, currentQuestion, rules)}</h3>
              {rule['sous-titre'] && (
                <p
                  css={`
                    color: #666;
                    font-size: 90%;
                  `}
                >
                  {rule['sous-titre']}
                </p>
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

            <FormButtons
              {...{
                currentValue,
                rules,
                setSearchParams,
                encodeSituation,
                answeredQuestions,
                currentQuestion,
                situation,
              }}
            />
          </AnswerWrapper>
        </div>
      </Card>
      <Notifications {...{ currentQuestion, engine }} />
      <QuestionDescription {...{ currentQuestion, rule }} />
    </div>
  )
}
