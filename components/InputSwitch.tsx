import AddressSearch from './AddressSearch'
import DPESelector from './DPESelector'
import { Input } from './InputUI'
import questionType from './publicodes/questionType'
import { encodeSituation } from './publicodes/situationUtils'

export default function InputSwitch({
  rule,
  currentValue,
  currentQuestion,
  situation,
  answeredQuestions,
  setSearchParams,
  engine,
}) {
  const ruleQuestionType = questionType(rule)
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
