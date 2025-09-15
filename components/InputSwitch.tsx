import { mpaLogementValues } from '@/app/module/AmpleurInputs'
import ArgileMap from '@/components/rga/ArgileMap'
import Input from '@codegouvfr/react-dsfr/Input'
import { serializeUnit } from 'publicodes'
import { useCallback, useState } from 'react'
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
import {
  decodeDottedName,
  encodeSituation,
  setValueToSituation,
} from './publicodes/situationUtils'
import { useSendDataToHost } from './useIsInIframe'

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
    noLabel: [
      'logement . adresse',
      'logement . surface',
      'ménage . personnes',
    ].includes(currentQuestion),
    noButtons: [
      'projet . définition . travaux envisagés',
      'projet . définition . travaux envisagés chauffage',
    ].includes(currentQuestion),
    questionsToSubmit:
      // Si une question fait appel à un API, il faut renseigner ici les questions qui sont répondues via ceet appel d'API
      // TODO Ce truc est subtil : sans ça, les missingVariables seront considérées comme vides et la simulation s'arrête sans qu'on ne comprenne pourquoi. J'ai mis du temps à le trouver. Ça mériterait d'être mieux gérer, par exemple via un attribut dans les règles, documenté, qui injecterait tout seul les valeurs données

      currentQuestion === 'copropriété . id'
        ? [
            'copropriété . id',
            'copropriété . nombre de lots principaux',
            'copropriété . nombre de logements',
            'copropriété . condition 15 ans',
          ]
        : [currentQuestion],
  }

  const setChoice = useCallback(
    (bdnb) => {
      const questionsToSubmit = {
        'logement . année de construction': {
          key: 'annee_construction',
          valueType: 'string',
        },

        "logement . zone d'exposition": {
          key: 'alea_argiles',
          valueType: 'string',
          valueFunction: (value) =>
            (value === null ? 'nul' : value).toLowerCase(),
        },
        'logement . rnb': {
          key: 'rnb',

          valueType: 'string',
        },
        'logement . niveaux': {
          key: 'nb_niveau',

          valueType: 'num',
        },
        'logement . code département': {},
      }

      const valid = Object.entries(questionsToSubmit)
        .filter(
          ([question, { key, valueFunction = (v) => v }]) =>
            question !== currentQuestion && // would validate the question before the submit button is clicked
            (!key || // TODO This is to validate code département. It's a hack : it should be validated by the Input that sets its value, like we do here. This logic should be set directly in publicode attributes and instrumented here.
              valueFunction(bdnb[key]) != null),
        )
        .map((el) => el[0])

      const newSituation = Object.fromEntries(
        Object.entries(questionsToSubmit)
          .map(
            ([question, { key, valueFunction = (v) => v, valueType }]) =>
              key != null && [
                question,
                setValueToSituation(valueType, valueFunction(bdnb[key])),
              ],
          )
          .filter(Boolean),
      )
      console.log({ valid })

      // On utilise setValueToSituation car niveaux peut être null
      // Exemple : https://api.bdnb.io/v1/bdnb/donnees/batiment_groupe_complet?batiment_groupe_id=eq.bdnb-bg-E756-YKX1-D181
      const encodedSituation = encodeSituation(
        {
          ...situation,

          ...newSituation,
        },
        false,
        [...answeredQuestions, ...valid],
      )

      setSearchParams(encodedSituation, 'push', false)
    },
    [setSearchParams, answeredQuestions, situation],
  )

  return currentQuestion ? (
    <ClassicQuestionWrapper {...params}>
      {currentQuestion === "logement . zone d'exposition" ? (
        <ArgileMap
          {...{
            setChoice,
            situation,
          }}
        />
      ) : rule['bornes intelligentes'] ? (
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
        <div className="fr-fieldset__element">
          <AddressSearch
            {...{
              addressResults,
              setAddressResults,
              situation,
              label: rules[currentQuestion].question,
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
                  'logement . clef ban': `"${adresse.properties.id}"`,
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
