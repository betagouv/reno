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

  if (!currentValue) {
    // Par défaut, on propose le maximum
    currentValue = currentQuestion.maximum
    onChange(currentValue)
  }
  const InputComponent = () =>
    ['oui', 'non'].includes(currentQuestion['par défaut']) ? (
      <SegmentedControl
        value={currentValue}
        name={question}
        onChange={onChange}
      />
    ) : currentQuestion['une possibilité parmi'] ? (
      <Select
        value={currentValue == null ? '' : currentValue}
        values={currentQuestion['une possibilité parmi']['possibilités'].map(
          (i) => rules[question + ' . ' + i],
        )}
        onChange={onChange}
      />
    ) : (
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
  return (
    <Section
      css={`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.8rem 0;
        padding: 0.4rem 0 1rem;
        border-bottom: 1px solid var(--lighterColor);
        &:last-child {
          border: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        > div {
          margin-right: 0.8rem;
          max-width: 60%;
        }
        > select,
        input,
        fieldset {
          max-width: 60%;
        }
        @media (max-width: 800px) {
          flex-wrap: wrap;
          justify-content: space-between;
          > div {
            margin-bottom: 0.8rem;
          }
          > select,
          input,
          fieldset {
            margin: 0 0 0 auto;
          }
        }
      `}
    >
      <div>{currentQuestion.question}</div>
      <InputComponent />
    </Section>
  )
}
