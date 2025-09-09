import { Input } from '@codegouvfr/react-dsfr/Input'
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons'
import { encodeSituation } from './publicodes/situationUtils'
import CommuneSearch from './CommuneSearch'
import RevenuInput from './RevenuInput'
import TargetDPETabs from './mpra/TargetDPETabs'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { serializeUnit } from 'publicodes'
import { useState } from 'react'
import AddressSearch from './AddressSearch'
import enrichSituation, { getCommune } from './personas/enrichSituation'

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
}) => {
  const [addressResults, setAddressResults] = useState(null)
  return ['oui', 'non'].includes(currentQuestion['par défaut']) ? (
    <RadioButtons
      legend={currentQuestion.question}
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
    <CommuneSearch
      {...{
        type: question,
        label: currentQuestion.question,
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
                    'ménage . commune . nom': `"${result.nom}"`,
                  }
                : {
                    'logement . code région': `"${result.codeRegion}"`,
                    'logement . code département': `"${result.codeDepartement}"`,
                    'logement . EPCI': `"${result.codeEpci}"`,
                    'logement . commune': `"${result.code}"`,
                    'logement . commune . nom': `"${result.nom}"`,
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
        setSearchParams,
        situation,
        text: '',
      }}
    />
  ) : question === 'logement . adresse' ? (
    <AddressSearch
      {...{
        label: rules[question].question,
        addressResults,
        setAddressResults,
        engine,
        situation,
        setCoordinates: () => true, // ([lon, lat]) => setSearchParams({ lon, lat }),
        onChange: async (adresse) => {
          const result = await getCommune(
            null,
            null,
            adresse.properties.citycode,
          )

          const newSituation = await enrichSituation({
            ...situation,
            'logement . adresse': `"${adresse.properties.label}"`,
            'logement . code région': `"${result.codeRegion}"`,
            'logement . code département': `"${result.codeDepartement}"`,
            'logement . EPCI': `"${result.codeEpci}"`,
            'logement . commune': `"${result.code}"`,
            'logement . commune . nom': `"${result.nom}"`,
          })
          setSearchParams(
            encodeSituation(newSituation, false, answeredQuestions),
            'push',
            false,
          )
        },
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
}
