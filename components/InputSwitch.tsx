import Input from '@codegouvfr/react-dsfr/Input'
import { serializeUnit } from 'publicodes'
import { useState } from 'react'
import AddressSearch from './AddressSearch'
import BinaryQuestion from './BinaryQuestion'
import CheckboxQuestion from './CheckboxQuestion'
import ChoixCategorieTravaux from './ChoixCategorieTravaux'
import ChoixTravaux from './ChoixTravaux'
import ChoixTravauxChauffage from './ChoixTravauxChauffage'
import ClassicQuestionWrapper from './ClassicQuestionWrapper'
import CommuneSearch from './CommuneSearch'
import Consentement from './Consentement'
import CoproAddressSearch from './CoproAddressSearch'
import Eligibility from './Eligibility'
import RadioQuestion from './RadioQuestion'
import RevenuInput from './RevenuInput'
import DPESelector from './dpe/DPESelector'
import enrichSituation, { getCommune } from './personas/enrichSituation'
import questionType from './publicodes/questionType'
import { decodeDottedName, encodeSituation } from './publicodes/situationUtils'
import { useSendDataToHost } from './useIsInIframe'

export default function InputSwitch({
  form,
  nbStep,
  currentQuestion: givenCurrentQuestion,
  situation,
  answeredQuestions,
  setSearchParams,
  engine,
  rules,
  nextQuestions,
  searchParams,
}) {
  const [addressResults, setAddressResults] = useState(null)
  const currentQuestion = searchParams.question
    ? decodeDottedName(searchParams.question)
    : givenCurrentQuestion

  const rule = rules[currentQuestion]
  const evaluation =
    currentQuestion && engine.setSituation(situation).evaluate(currentQuestion)
  const ruleQuestionType = currentQuestion && questionType(evaluation, rule)
  const rawValue = situation[currentQuestion]
  const currentValue =
    rawValue && (ruleQuestionType === 'text' ? rawValue.slice(1, -1) : rawValue)

  const [sendDataToHost, consent, setConsent] = useSendDataToHost()
  const params = {
    form,
    nbStep,
    rule,
    currentQuestion,
    rules,
    answeredQuestions,
    situation,
    setSearchParams,
    nextQuestions,
    currentValue,
    engine,
    suggestions: rule && rule['suggestions'],
    noLabel: [
      'logement . surface',
      'copropriété . nombre de logements',
      'ménage . personnes',
    ].includes(currentQuestion),
    noButtons: [
      'projet . définition . travaux envisagés',
      'projet . définition . travaux envisagés chauffage',
    ].includes(currentQuestion),
    questionsToSubmit:
      currentQuestion === 'copropriété . id'
        ? [
            'copropriété . id',
            'copropriété . nombre de lots principaux',
            'copropriété . nombre de logements',
            'copropriété . condition 15 ans',
          ]
        : [currentQuestion],
  }

  return currentQuestion ? (
    <ClassicQuestionWrapper {...params}>
      {rule['bornes intelligentes'] ? (
        <RevenuInput
          type={ruleQuestionType}
          rule={rule}
          engine={engine}
          evaluation={evaluation}
          situation={situation}
          placeholder={evaluation.nodeValue}
          value={currentValue == null ? '' : currentValue}
          name={currentQuestion}
          onChange={(value) => {
            const encodedSituation = encodeSituation(
              {
                ...situation,
                [currentQuestion]: value,
              },
              false,
              answeredQuestions,
            )
            setSearchParams(encodedSituation, 'replace', false)
          }}
        />
      ) : rule['une possibilité parmi'] ? (
        <RadioQuestion
          rule={rule}
          engine={engine}
          value={currentValue == null ? '' : currentValue}
          name={currentQuestion}
          onChange={(value) => {
            const encodedSituation = encodeSituation(
              {
                ...situation,
                [currentQuestion]: `"${value}"`,
              },
              false,
              answeredQuestions,
            )
            setSearchParams(encodedSituation, 'replace', false)
          }}
        />
      ) : rule['possibilités'] ? (
        <CheckboxQuestion
          {...{
            rule,
            engine,
            situation,
            setSearchParams,
            currentQuestion,
          }}
        />
      ) : ['ménage . commune', 'logement . commune'].includes(
          currentQuestion,
        ) ? (
        <div className="fr-fieldset__element">
          <CommuneSearch
            {...{
              type: currentQuestion,
              setChoice: (result) => {
                const encodedSituation = encodeSituation(
                  currentQuestion == 'ménage . commune'
                    ? {
                        ...situation,
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
                        'taxe foncière . commune . éligible':
                          result.eligibilite[
                            'taxe foncière . commune . éligible'
                          ],
                        'taxe foncière . commune . taux':
                          result.eligibilite['taxe foncière . commune . taux'],
                        'logement . commune . denormandie':
                          result.eligibilite[
                            'logement . commune . denormandie'
                          ],
                      },
                  false,
                  answeredQuestions,
                )

                setSearchParams(encodedSituation, 'push', false)
              },
              situation,
            }}
          />
        </div>
      ) : currentQuestion === 'logement . adresse' ? (
        <div className="fr-fieldset__element">
          <AddressSearch
            {...{
              addressResults,
              setAddressResults,
              situation,
              engine,
              hideLabel: true,
              coordinates: [searchParams.lon, searchParams.lat],
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
                  'logement . coordonnees': `"${adresse.geometry.coordinates.reverse().join(',')}"`,
                })
                setSearchParams(
                  encodeSituation(newSituation, false, answeredQuestions),
                  'push',
                  false,
                )
              },
            }}
          />
        </div>
      ) : currentQuestion ===
        'projet . définition . catégories travaux envisagées' ? (
        <ChoixCategorieTravaux
          {...{
            situation,
            rules,
            engine,
            setSearchParams,
            answeredQuestions,
          }}
        />
      ) : currentQuestion === 'projet . définition . travaux envisagés' ? (
        <ChoixTravaux
          {...{
            situation,
            rules,
            engine,
            setSearchParams,
            answeredQuestions,
          }}
        />
      ) : currentQuestion ===
        'projet . définition . travaux envisagés chauffage' ? (
        <ChoixTravauxChauffage
          {...{
            situation,
            rules,
            engine,
            setSearchParams,
            answeredQuestions,
          }}
        />
      ) : ['DPE . actuel'].includes(currentQuestion) ? (
        <DPESelector
          {...{
            currentQuestion,
            setSearchParams,
            situation,
            answeredQuestions,
          }}
        />
      ) : currentQuestion === 'copropriété . id' ? (
        <CoproAddressSearch
          {...{
            type: currentQuestion,
            setChoice: (result) => {
              const constructionPeriod = result['periode']
              const lessThan15Years = constructionPeriod === 'A_COMPTER_DE_2011'
              const moreThan15Years =
                !lessThan15Years && constructionPeriod.match(/\d\d\d\d/)

              const id = result['id']
              const encodedSituation = encodeSituation(
                {
                  ...situation,
                  'logement . code région': `"${result['codeReg']}"`,
                  'logement . code département': `"${result['codeDep']}"`,
                  'logement . EPCI': `"${result['epci']}"`,
                  'logement . commune': `"${result['codeCommune']}"`,
                  'logement . commune . nom': `"${result['nomCommune']}"`,
                  'copropriété . id': `"${id}"`,
                  'copropriété . nom': `"${result['adresse']}"`,
                  'copropriété . nombre de lots principaux':
                    result['lotsTotal'],
                  'copropriété . nombre de logements': result['lotsHab'],
                  ...(lessThan15Years
                    ? { 'copropriété . condition 15 ans': 'non' }
                    : moreThan15Years
                      ? { 'copropriété . condition 15 ans': 'oui' }
                      : {}),
                },
                false,
                answeredQuestions,
              )

              setSearchParams(encodedSituation, 'push', false)
            },
            situation,
          }}
        />
      ) : ruleQuestionType === 'boolean' ? (
        <BinaryQuestion
          value={currentValue}
          onChange={(value) => {
            const encodedSituation = encodeSituation(
              {
                ...situation,
                [currentQuestion]: value,
              },
              false,
              answeredQuestions,
            )

            setSearchParams(encodedSituation, 'push', false)
          }}
        />
      ) : (
        <div className="fr-fieldset__element">
          <Input
            label={rules[currentQuestion].question}
            nativeInputProps={{
              type: ruleQuestionType,
              name: currentQuestion,
              min: 1,
              autoFocus: true,
              onChange: (e) => {
                const value = e.target.value
                const encodedSituation = encodeSituation(
                  {
                    ...situation,
                    [currentQuestion]:
                      value == '' || parseInt(value) <= 0
                        ? undefined
                        : ruleQuestionType === 'number'
                          ? value
                          : `"${value}"`,
                  },
                  false,
                  answeredQuestions,
                )

                setSearchParams(encodedSituation, 'replace', false)
              },
              value: currentValue == null ? '' : currentValue,
            }}
            addon={
              serializeUnit(evaluation.unit) === 'personne' && currentValue > 1
                ? 'personnes'
                : serializeUnit(evaluation.unit)
            }
          />
        </div>
      )}
    </ClassicQuestionWrapper>
  ) : sendDataToHost && consent === null ? (
    <Consentement {...{ setConsent, situation, sendDataToHost }} />
  ) : (
    <Eligibility
      {...{
        nbStep,
        currentQuestion,
        searchParams,
        setSearchParams,
        situation,
        answeredQuestions,
        engine,
        rules,
        nextQuestions,
        expanded: searchParams.details === 'oui',
        consent,
        sendDataToHost,
      }}
    />
  )
}
