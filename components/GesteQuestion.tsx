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
  setSearchParams
}) {
  const currentQuestion = rules[question]
  if (!currentQuestion) return null
  const evaluation = currentQuestion && engine.setSituation(situation).evaluate(question)
  let currentValue = situation[question]
  const onChange = (value) => {
    const encodedSituation = encodeSituation(
      {
        ...situation,
        [question]: value == undefined ? undefined : value,
      },
      false,
      [],
    )
    setSearchParams(encodedSituation, 'push', false)

  }

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
      <InputComponent
        {...{
          currentQuestion,
          currentValue,
          question,
          onChange,
          rules,
          engine,
          situation,
          setSearchParams,
          evaluation,
        }}
      />
    </div>
  )
}
const InputComponent = ({
  currentQuestion,
  currentValue,
  question,
  onChange,
  rules,
  engine,
  situation,
  setSearchParams,
  evaluation,
}) =>
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
            [],
          )

          setSearchParams(encodedSituation, 'push', false)
        },
        setSearchParams,
        situation
      }}
    />
  ) : question === 'ménage . revenu' ? (
    <SmartInput
        type='select'
        engine={engine}
        situation={situation}
        value={currentValue == null ? '' : currentValue}
        onChange={onChange}
      />
  ) : (
    <Input
      type={'number'}
      placeholder={evaluation.nodeValue}
      value={currentValue == null ? '' : currentValue}
      name={question}
      unit={evaluation.unit}
      onChange={onChange}
    />
  )