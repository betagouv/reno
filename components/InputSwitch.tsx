import AddressSearch from './AddressSearch'
import BinaryQuestion from './BinaryQuestion'
import BooleanMosaic, {
  isMosaicQuestion,
  mosaicQuestionText,
} from './BooleanMosaic'
import DPESelector from './DPESelector'
import { Input } from './InputUI'
import questionType from './publicodes/questionType'
import { encodeSituation } from './publicodes/situationUtils'
import { getRuleName } from './publicodes/utils'
export const getQuestionText = (rule, dottedName, rules) => {
  if (isMosaicQuestion(dottedName, rule))
    return mosaicQuestionText(rules, dottedName)
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
  const defaultValue = currentQuestion && engine.evaluate(currentQuestion)

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

  if (isMosaicQuestion(currentQuestion, rule))
    return (
      <BooleanMosaic
        {...{
          rules,
          rule,
          engine,
          situation,
          answeredQuestions,

          setSearchParams,
        }}
      />
    )

  if (ruleQuestionType === 'boolean') return <BinaryQuestion />
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
