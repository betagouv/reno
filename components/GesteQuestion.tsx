import { Section } from '@/components/UI'
import Input from './Input'
import Select from './Select'
import SegmentedControl from './SegmentedControl'
import { encodeSituation } from './publicodes/situationUtils'
export default function GesteQuestion({
  rules,
  question,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
}) {
  const currentQuestion = rules[question]
  if (!currentQuestion) return null

  const evaluation = engine.evaluate(currentQuestion)
  let currentValue = situation[question]
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

  if(!currentValue) {
    // Par défaut, on propose le maximum
    currentValue = currentQuestion.maximum;
    onChange(currentValue)
  }
  const InputComponent = () => (
    ["oui", "non"].includes(currentQuestion["par défaut"]) ?
    <SegmentedControl
      value={currentValue}
      name={question}
      onChange={onChange} 
    />
    : (currentQuestion["une possibilité parmi"] ?
        <Select
          value={currentValue == null ? '' : currentValue}
          values={currentQuestion["une possibilité parmi"]["possibilités"].map((i) => rules[question + " . " + i])}
          onChange={onChange}
        />
      :
        <Input
          type={'number'}
          id={question}
          placeholder={evaluation.nodeValue}
          value={currentValue == null ? '' : currentValue}
          name={question}
          unit={evaluation.unit}
          onChange={onChange}
        />
    )
  )
  return (
    <div>
      <Section css={`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;`}>
        <div>{ currentQuestion.question }</div>
        <InputComponent />
      </Section>
    </div>
  );
}
