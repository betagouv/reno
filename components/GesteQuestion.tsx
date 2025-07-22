import { Input } from '@codegouvfr/react-dsfr/Input'
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons'
import { encodeSituation } from './publicodes/situationUtils'
import AddressSearch from './AddressSearch'
import RevenuInput from './RevenuInput'
import TargetDPETabs from './mpra/TargetDPETabs'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { serializeUnit } from 'publicodes'

export default function GesteQuestion({
  rules,
  question,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  onChangeEvent,
  autoFocus,
}) {
  const currentQuestion = rules[question]
  if (!currentQuestion) return null
  const evaluation =
    currentQuestion && engine.setSituation(situation).evaluate(question)
  let currentValue = situation[question]
  const onChange = (e) => {
    const value = e.target.value
    onChangeEvent && onChangeEvent(value)
    const encodedSituation = encodeSituation(
      {
        ...situation,
        [question]: value == undefined || value == '' ? undefined : value,
      },
      false,
      answeredQuestions,
    )
    setSearchParams(encodedSituation, 'push', false)
  }

  return (
    <div className="fr-mb-5v">
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
    <RadioButtons
      legend={currentQuestion.question}
      name="radio"
      options={[
        {
          label: 'Oui',
          nativeInputProps: {
            value: 'oui',
            checked: currentValue === 'oui',
            onChange: onChange,
          },
        },
        {
          label: 'Non',
          nativeInputProps: {
            value: 'non',
            checked: currentValue === 'non',
            onChange: onChange,
          },
        },
      ]}
      state={currentValue !== undefined && 'success'}
      stateRelatedMessage=""
      orientation="horizontal"
    />
  ) : currentQuestion['une possibilité parmi'] ? (
    <Select
      label={currentQuestion.question}
      nativeSelectProps={{
        onChange: onChange,
        value: currentValue == null ? '' : currentValue,
      }}
      state={currentValue !== undefined ? 'success' : 'default'}
    >
      <option value="" disabled>
        Sélectionnez une option
      </option>
      {currentQuestion['une possibilité parmi']['possibilités'].map((i) => (
        <option key={i} value={rules[question + ' . ' + i].valeur}>
          {rules[question + ' . ' + i].titre}
        </option>
      ))}
    </Select>
  ) : ['ménage . commune', 'logement . commune'].includes(question) ? (
    <AddressSearch
      {...{
        label: currentQuestion.question,
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
      label={currentQuestion.question}
      type="select"
      engine={engine}
      situation={situation}
      value={currentValue == null ? '' : currentValue}
      onChange={onChange}
    />
  ) : question === 'projet . DPE visé' ? (
    <TargetDPETabs
      {...{
        oldIndex: situation['DPE . actuel'] - 1,
        choice: Math.max(1, situation['projet . DPE visé'] - 1),
        setSearchParams,
        answeredQuestions,
        engine,
        situation,
        text: '',
      }}
    />
  ) : (
    <Input
      nativeInputProps={{
        type: 'number',
        min: 1,
        name: question,
        onChange: onChange,
        value: currentValue == null ? '' : currentValue,
      }}
      addon={
        serializeUnit(evaluation.unit) === 'personne' && currentValue > 1
          ? 'personnes'
          : serializeUnit(evaluation.unit)
      }
      state={currentValue !== undefined && 'success'}
      stateRelatedMessage=""
      label={currentQuestion.question}
      autoFocus={autoFocus}
    />
  )
