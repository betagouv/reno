import AddressSearch from './AddressSearch'
import BinaryQuestion from './BinaryQuestion'

import BooleanMosaic, { isMosaicQuestion } from './BooleanMosaic'

import FormButtons from '@/app/simulation/FormButtons'
import { QuestionHeader } from '@/app/simulation/QuestionHeader'
import Suggestions from '@/app/simulation/Suggestions'
import DPESelector from './DPESelector'
import GestesMosaic, {
  gestesMosaicQuestionText,
  isGestesMosaicQuestion,
} from './GestesMosaic'
import { AnswerWrapper, Input } from './InputUI'
import MPRSelector from './MPRSelector'
import questionType from './publicodes/questionType'
import { encodeSituation } from './publicodes/situationUtils'
import { getRuleName } from './publicodes/utils'
import RhetoricalQuestion from './RhetoricalQuestion'
import ScenariosSelector from './ScenariosSelector'
import { Card } from './UI'
import Notifications from './Notifications'
import QuestionDescription from './QuestionDescription'

export const getQuestionText = (rule, dottedName, rules) => {
  if (isMosaicQuestion(dottedName, rule, rules))
    return gestesMosaicQuestionText(rules, dottedName)
  const ruleName = getRuleName(dottedName)
  const text = rule.question || rule.titre || ruleName
  return text
}

export default function InputSwitch({
  rule,
  currentValue,
  currentQuestion,
  situation,
  answeredQuestions,
  setSearchParams,
  engine,
  rules,
}) {
  const ruleQuestionType = questionType(rule, rules[currentQuestion])
  console.log('question type', ruleQuestionType)
  const defaultValue = currentQuestion && engine.evaluate(currentQuestion)

  const ClassicQuestionWrapper = ({ children }) => (
    <div>
      <Card>
        <div>
          {(!rule.type || !rule.type === 'question rhétorique') && (
            <QuestionHeader>
              <h3>{getQuestionText(rule, currentQuestion, rules)}</h3>
            </QuestionHeader>
          )}
          <AnswerWrapper>
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
                  true,
                  false,
                )
              }
            />
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

  if (rule.type === 'question rhétorique')
    return (
      <ClassicQuestionWrapper>
        <RhetoricalQuestion
          {...{
            effect: () => setSearchParams({ [currentQuestion]: 'oui' }),
            situation,
            answeredQuestions,
            html: rule.descriptionHtml,
          }}
        />
      </ClassicQuestionWrapper>
    )
  if (currentQuestion === 'région')
    return (
      <ClassicQuestionWrapper>
        <AddressSearch
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
          }}
        />
      </ClassicQuestionWrapper>
    )

  if (['DPE . actuel'].includes(currentQuestion))
    return (
      <ClassicQuestionWrapper>
        <DPESelector
          {...{
            currentQuestion,
            setSearchParams,
            situation,
            answeredQuestions,
          }}
        />
      </ClassicQuestionWrapper>
    )
  if (['DPE . visé', 'travaux'].includes(currentQuestion))
    return (
      <ScenariosSelector
        {...{
          currentQuestion,
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
        }}
      />
    )
  if (['MPR . choix'].includes(currentQuestion))
    return (
      <MPRSelector
        {...{
          currentQuestion,
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
          rules,
        }}
      />
    )

  const gestesMosaic = isGestesMosaicQuestion(currentQuestion, rule, rules)
  if (gestesMosaic)
    return (
      <ClassicQuestionWrapper>
        <GestesMosaic
          {...{
            rules,
            rule,
            engine,
            situation,
            answeredQuestions,
            setSearchParams,
            questions: gestesMosaic,
          }}
        />
      </ClassicQuestionWrapper>
    )
  // We kept the latter component before it got really specialized. TODO not completely functional
  const mosaic = isMosaicQuestion(currentQuestion, rule, rules)
  if (mosaic)
    return (
      <ClassicQuestionWrapper>
        <BooleanMosaic
          {...{
            rules,
            rule,
            engine,
            situation,
            answeredQuestions,
            setSearchParams,
            questions: mosaic,
          }}
        />
      </ClassicQuestionWrapper>
    )

  if (ruleQuestionType === 'boolean')
    return (
      <ClassicQuestionWrapper>
        <BinaryQuestion
          value={currentValue}
          onChange={(value) => {
            const encodedSituation = encodeSituation(
              {
                ...situation,
                [currentQuestion]: value,
              },
              false,
              answeredQuestions,
            )
            console.log(
              'binary question on change will set encodedSituation',
              encodedSituation,
            )

            setSearchParams(encodedSituation, false, false)
          }}
        />
      </ClassicQuestionWrapper>
    )
  return (
    <ClassicQuestionWrapper>
      <Input
        type={ruleQuestionType}
        placeholder={defaultValue.nodeValue}
        value={currentValue == null ? '' : currentValue}
        name={currentQuestion}
        onChange={(e) => {
          const encodedSituation = encodeSituation(
            {
              ...situation,
              [currentQuestion]:
                ruleQuestionType === 'number'
                  ? e.target.value
                  : `"${e.target.value}"`,
            },
            false,
            answeredQuestions,
          )
          console.log('on change will set encodedSituation', encodedSituation)

          setSearchParams(encodedSituation, false, false)
        }}
      />
    </ClassicQuestionWrapper>
  )
}
