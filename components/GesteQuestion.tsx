import { getQuestionText } from './ClassicQuestionWrapper'
import { Prime } from './Geste'
import Input from './Input'
import { formatValue } from 'publicodes'
import { encodeSituation } from './publicodes/situationUtils'
export default function GesteQuestion({
  dottedName,
  rules,
  nextQuestions,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
}) {
  const question = nextQuestions.find((question) =>
    question.startsWith(dottedName),
  )
  if (!question) return null

  const evaluation = engine.evaluate(question),
    currentValue = situation[question]

  const onChange = (value) => {
    const encodedSituation = encodeSituation(
      {
        ...situation,
        [question]: value == undefined ? undefined : value,
      },
      false,
      answeredQuestions,
    )

    setSearchParams(encodedSituation, 'push', false)
  }

  const InputComponent = () => (
    <Input
      type={'number'}
      placeholder={evaluation.nodeValue}
      value={currentValue == null ? '' : currentValue}
      name={question}
      unit={evaluation.unit}
      onChange={onChange}
    />
  )
  return (
    <div
      css={`
        margin: 0.6rem 0;
        > label {
          margin: 1rem 0;
          display: flex;
          justify-content: end;
          align-items: center;
          flex-wrap: wrap;
          > div {
            margin-right: 1rem;
          }
        }
      `}
    >
      <label>
        <div>{getQuestionText(rules[question], question, rules)}</div>
        <InputComponent />
      </label>
      <div
        css={`
          text-align: right;
        `}
      >
        <Prime
          value={formatValue(
            engine.setSituation(situation).evaluate(dottedName + ' . montant'),
          )}
        />
      </div>
    </div>
  )
}
