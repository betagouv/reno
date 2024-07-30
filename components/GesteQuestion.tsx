import Input from './Input'
import Select from './Select'
import SegmentedControl from './SegmentedControl'
import { encodeSituation } from './publicodes/situationUtils'
import AddressSearch from './AddressSearch'
import SmartInput from './SmartInput'
export default function GesteQuestion({
  rules,
  question,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
  onAnswered
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

    if (onAnswered) {
      onAnswered();
    }
  }

  if (!currentValue && currentQuestion.maximum) {
    // Par défaut, on propose le maximum s'il existe
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
    ) : question === 'ménage . commune' ? (
      <AddressSearch
        {...{
          setChoice: (result) => {
            console.log('purple result ', result)
            const codeRegion = result.codeRegion
            const encodedSituation = encodeSituation(
              {
                ...situation,
                'ménage . code région': `"${codeRegion}"`,
                'ménage . code département': `"${result.codeDepartement}"`,
                'ménage . EPCI': `"${result.codeEpci}"`,
                'ménage . commune': `"${result.code}"`,
              },
              false,
              answeredQuestions,
            )

            setSearchParams(encodedSituation, 'push', false)

            if (onAnswered) {
              onAnswered();
            }
          },
          setSearchParams,
          situation,
          answeredQuestions,
        }}
      />
    ) : question === 'ménage . revenu' ? (
      <SmartInput
          type='select'
          rule={currentQuestion}
          engine={engine}
          evaluation={evaluation}
          situation={situation}
          placeholder={evaluation.nodeValue}
          value={currentValue == null ? '' : currentValue}
          name={currentQuestion}
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
    <div
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
    </div>
  )
}