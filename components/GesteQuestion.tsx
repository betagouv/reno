import Input from './Input'
import Select from './Select'
import SegmentedControl from './SegmentedControl'
import { encodeSituation } from './publicodes/situationUtils'
import AddressSearch from './AddressSearch'
import RevenuInput from './RevenuInput'
import { Dot } from '@/app/module/AmpleurQuestions'

export default function GesteQuestion({
  rules,
  question,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  autoFocus,
  dot = false,
}) {
  const currentQuestion = rules[question]
  if (!currentQuestion) return null
  const evaluation =
    currentQuestion && engine.setSituation(situation).evaluate(question)
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

  return (
    <div
      css={`
        display: flex;
        ${!dot && 'justify-content: space-between;'}
        ${dot && 'gap: 1rem;'}
        align-items: center;
        margin: ${!dot ? '0.8rem' : '0'} 0;
        padding: 0.4rem 0 1rem;
        ${!dot && `border-bottom: 1px solid var(--lighterColor);`}
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
        img {
          width: 1rem;
          height: auto;
        }
      `}
    >
      {dot && <Dot css={``} />}
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
          answeredQuestions,
          setSearchParams,
          evaluation,
          autoFocus,
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
  answeredQuestions,
  setSearchParams,
  evaluation,
  autoFocus,
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
  ) : ['ménage . commune', 'logement . commune'].includes(question) ? (
    <AddressSearch
      {...{
        type: question,
        setChoice: (result) => {
          const encodedSituation = encodeSituation(
            {
              ...situation,
              ...(question === 'ménage . commune'
                ? {
                    'ménage . code région': `"${result.codeRegion}"`,
                    'ménage . code département': `"${result.codeDepartement}"`,
                    'ménage . EPCI': `"${result.codeEpci}"`,
                    'ménage . commune': `"${result.code}"`,
                  }
                : {
                    'logement . code région': `"${result.codeRegion}"`,
                    'logement . code département': `"${result.codeDepartement}"`,
                    'logement . EPCI': `"${result.codeEpci}"`,
                    'logement . commune': `"${result.code}"`,
                  }),
            },
            false,
            answeredQuestions,
          )

          setSearchParams(encodedSituation, 'push', false)
        },
        situation,
        autoFocus,
      }}
    />
  ) : question === 'ménage . revenu' ? (
    <RevenuInput
      type="select"
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
      autoFocus={autoFocus}
    />
  )
