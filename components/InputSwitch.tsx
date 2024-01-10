import AddressSearch from './AddressSearch'
import BinaryQuestion from './BinaryQuestion'

import BooleanMosaic, {
  isMosaicQuestion,
  mosaicQuestionText,
} from './BooleanMosaic'

import GestesMosaic, {
  isGestesMosaicQuestion,
  gestesMosaicQuestionText,
} from './GestesMosaic'
import DPESelector from './DPESelector'
import { Input } from './InputUI'
import questionType from './publicodes/questionType'
import { encodeSituation } from './publicodes/situationUtils'
import { getRuleName } from './publicodes/utils'
import RhetoricalQuestion from './RhetoricalQuestion'

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

  if (rule.type === 'question rhétorique')
    return (
      <RhetoricalQuestion
        {...{
          effect: () => setSearchParams({ [currentQuestion]: 'oui' }),
          situation,
          answeredQuestions,
          html: rule.descriptionHtml,
        }}
      />
    )
  if (currentQuestion === 'région')
    return (
      <AddressSearch
        {...{
          setSearchParams,
          situation,
          answeredQuestions,
        }}
      />
    )

  if (['DPE . actuel', 'DPE . visé'].includes(currentQuestion))
    return (
      <DPESelector
        {...{
          currentQuestion,
          setSearchParams,
          situation,
          answeredQuestions,
        }}
      />
    )

  const gestesMosaic = isGestesMosaicQuestion(currentQuestion, rule, rules)
  if (gestesMosaic)
    return (
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
    )
  // We kept the latter component before it got really specialized. TODO not completely functional
  const mosaic = isMosaicQuestion(currentQuestion, rule, rules)
  if (mosaic)
    return (
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
    )

  if (ruleQuestionType === 'boolean')
    return (
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
    )
  return (
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
  )
}
