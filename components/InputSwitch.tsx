import CommuneSearch from './CommuneSearch'
import BinaryQuestion from './BinaryQuestion'
import { decodeDottedName, encodeSituation } from './publicodes/situationUtils'
import ClassicQuestionWrapper from './ClassicQuestionWrapper'
import DPESelector from './dpe/DPESelector'
import Eligibility from './Eligibility'
import RadioQuestion from './RadioQuestion'
import CheckboxQuestion from './CheckboxQuestion'
import RevenuInput from './RevenuInput'
import questionType from './publicodes/questionType'
import CoproAddressSearch from './CoproAddressSearch'
import DPEMap from './dpe/DPEMap'
import AddressSearch from './AddressSearch'
import { useState } from 'react'
import enrichSituation, { getCommune } from './personas/enrichSituation'
import { useSendDataToHost } from './useIsInIframe'
import Consentement from './Consentement'
import ChoixTravauxChauffage from './ChoixTravauxChauffage'
import ChoixCategorieTravaux from './ChoixCategorieTravaux'
import ChoixTravaux from './ChoixTravaux'
import Input from '@codegouvfr/react-dsfr/Input'
import { serializeUnit } from 'publicodes'
import { mpaLogementValues } from '@/app/module/AmpleurInputs'

export default function InputSwitch({
  form,
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
          currentQuestion={currentQuestion}
          situation={situation}
          placeholder={evaluation.nodeValue}
          value={currentValue == null ? '' : currentValue}
          name={currentQuestion}
          onChange={(value) => {
            if (currentQuestion == 'mpa . situation demandeur') {
              const additionalSituation = mpaLogementValues.find(
                ({ valeur }) => valeur == value,
              ).situation

              const encodedSituation = encodeSituation(
                additionalSituation,
                true,
                [
                  ...Object.keys(additionalSituation).filter(
                    (r) => r != 'mpa . situation demandeur',
                  ),
                ],
              )
              setSearchParams(encodedSituation)
            } else {
              const encodedSituation = encodeSituation(
                {
                  ...situation,
                  [currentQuestion]: `"${value}"`,
                },
                false,
                answeredQuestions,
              )
              setSearchParams(encodedSituation, 'replace', false)
            }
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
                        result.eligibilite['logement . commune . denormandie'],
                    },
                false,
                answeredQuestions,
              )

              setSearchParams(encodedSituation, 'push', false)
            },
            situation,
          }}
        />
      ) : currentQuestion === 'logement . adresse' ? (
        <AddressSearch
          {...{
            addressResults,
            setAddressResults,
            situation,
            coordinates: [searchParams.lon, searchParams.lat],
            setCoordinates: ([lon, lat]) => setSearchParams({ lon, lat }),
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
      ) : // <DPEMap
      //   {...{
      //     searchParams,
      //     addressResults,
      //     dpeListStartOpen: false,
      //     showDpeList: false,
      //   }}
      // />
      currentQuestion ===
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
              const constructionPeriod = result['Période de construction']
              const lessThan15Years = constructionPeriod === 'A_COMPTER_DE_2011'
              // these are the possible values, obtained with the server route /periodes-construction
              // ["AVANT_1949","A_COMPTER_DE_2011","DE_1949_A_1960","DE_1961_A_1974","DE_1975_A_1993","DE_1994_A_2000","DE_2001_A_2010","NON_CONNUE","non renseigné"]
              const moreThan15Years =
                !lessThan15Years && constructionPeriod.match(/\d\d\d\d/)

              const id = result["Numéro d'immatriculation"]
              console.log('cyan id', id)
              const encodedSituation = encodeSituation(
                {
                  ...situation,
                  'logement . code région': `"${result['Code Officiel Région']}"`,
                  'logement . code département': `"${result['Code Officiel Département']}"`,
                  'logement . EPCI': `"${result['Code Officiel EPCI']}"`,
                  'logement . commune': `"${result['Commune']}"`,
                  'logement . commune . nom': `"${result['Nom Officiel Commune']}"`,
                  'copropriété . id': `"${id}"`,
                  'copropriété . nom': `"${result['Nom d’usage de la copropriété']}"`,
                  'copropriété . nombre de lots principaux': `"${result['Nombre total de lots à usage d’habitation, de bureaux ou de commerces']}"`,
                  'copropriété . nombre de logements': `"${result['Nombre de lots à usage d’habitation']}"`,
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
                      value == undefined
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
