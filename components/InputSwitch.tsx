import AddressSearch from './AddressSearch'
import BinaryQuestion from './BinaryQuestion'
import {
  decodeDottedName,
  encodeSituation,
  getAnsweredQuestions,
} from './publicodes/situationUtils'

import BooleanMosaic, { isMosaicQuestion } from './BooleanMosaic'
import ClassicQuestionWrapper from './ClassicQuestionWrapper'

import { firstLevelCategory } from '@/app/simulation/Answers'
import DPESelector from './dpe/DPESelector'
import GestesBasket from './GestesBasket'
import GestesMosaic, { gestesMosaicQuestions } from './GestesMosaic'
import Input from './Input'
import Eligibility from './Eligibility'
import RadioQuestion from './RadioQuestion'
import AidesAmpleur from '@/components/ampleur/AidesAmpleur'
import RevenuInput from './RevenuInput'
import questionType from './publicodes/questionType'
import CoproAddressSearch from './CoproAddressSearch'
import { useSendDataToHost } from './useIsInIframe'
import Consentement from './Consentement'

export default function InputSwitch({
  currentQuestion: givenCurrentQuestion,
  situation,
  answeredQuestions,
  setSearchParams,
  engine,
  rules,
  nextQuestions,
  searchParams,
  correspondance,
}) {
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

  if (rule['bornes intelligentes'])
    return (
      <ClassicQuestionWrapper
        {...{
          rule,
          nextQuestions,
          currentQuestion,
          rules,
          answeredQuestions,
          situation,
          setSearchParams,
          currentValue,
          engine,
          noSuggestions: true,
        }}
      >
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
      </ClassicQuestionWrapper>
    )

  if (rule['une possibilité parmi'])
    return (
      <ClassicQuestionWrapper
        {...{
          rule,
          currentQuestion,
          rules,
          answeredQuestions,
          situation,
          setSearchParams,
          nextQuestions,
          currentValue,
          engine,
          noSuggestions: true,
        }}
      >
        <RadioQuestion
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
                [currentQuestion]: `"${value}"`,
              },
              false,
              answeredQuestions,
            )
            setSearchParams(encodedSituation, 'replace', false)
          }}
        />
      </ClassicQuestionWrapper>
    )

  if (currentQuestion === 'copropriété . id')
    return (
      <ClassicQuestionWrapper
        {...{
          nextQuestions,
          rule,
          currentQuestion,
          rules,
          answeredQuestions,
          situation,
          setSearchParams,
          questionsToSubmit: [
            'copropriété . id',
            'copropriété . nombre de lots principaux',
            'copropriété . nombre de logements',
            'copropriété . condition 15 ans',
          ],
          currentValue,
          engine,
        }}
      >
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
      </ClassicQuestionWrapper>
    )
  if (['ménage . commune', 'logement . commune'].includes(currentQuestion))
    return (
      <ClassicQuestionWrapper
        {...{
          nextQuestions,
          rule,
          currentQuestion,
          rules,
          answeredQuestions,
          situation,
          setSearchParams,
          currentValue,
          engine,
        }}
      >
        <AddressSearch
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
      </ClassicQuestionWrapper>
    )

  if (['DPE . actuel'].includes(currentQuestion))
    return (
      <ClassicQuestionWrapper
        {...{
          rule,
          nextQuestions,
          currentQuestion,
          rules,
          answeredQuestions,
          situation,
          setSearchParams,
          currentValue,
          engine,
        }}
      >
        <DPESelector
          {...{
            currentQuestion,
            setSearchParams,
            situation,
            answeredQuestions,
          }}
        />
      </ClassicQuestionWrapper>
    )

  if (currentQuestion === 'MPR . non accompagnée . confirmation') {
    return (
      <GestesBasket
        {...{
          rules,
          engine,
          situation,
          answeredQuestions,
          setSearchParams,
          searchParams,
        }}
      />
    )
  }

  if (
    getAnsweredQuestions(searchParams, rules).includes("parcours d'aide") &&
    searchParams["parcours d'aide"].includes('à la carte')
  ) {
    return (
      <GestesMosaic
        {...{
          rules,
          engine,
          situation,
          answeredQuestions,
          setSearchParams,
          searchParams,
          questions: gestesMosaicQuestions,
        }}
      />
    )
  }

  if (firstLevelCategory(currentQuestion) === 'projet') {
    return (
      <AidesAmpleur
        {...{
          currentQuestion,
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
          rules,
          searchParams,
          correspondance,
        }}
      />
    )
  }

  if (["parcours d'aide"].includes(currentQuestion)) {
    console.debug('indigo consent', sendDataToHost, consent)
    if (sendDataToHost && consent === null) {
      return <Consentement {...{ setConsent, situation, sendDataToHost }} />
    }
    return (
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
  // We kept the latter component before it got really specialized. TODO not completely functional
  const mosaic = isMosaicQuestion(currentQuestion, rule, rules)
  if (mosaic)
    return (
      <ClassicQuestionWrapper
        {...{
          nextQuestions,
          rule,
          currentQuestion,
          rules,
          answeredQuestions,
          situation,
          setSearchParams,
          currentValue,
          engine,
        }}
      >
        <BooleanMosaic
          {...{
            rules,
            rule,
            engine,
            situation,
            answeredQuestions,
            setSearchParams,
            questions: mosaic,
          }}
        />
      </ClassicQuestionWrapper>
    )

  if (ruleQuestionType === 'boolean')
    return (
      <ClassicQuestionWrapper
        {...{
          rule,
          nextQuestions,
          currentQuestion,
          rules,
          answeredQuestions,
          situation,
          setSearchParams,
          currentValue,
          engine,
        }}
      >
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
            console.log(
              'binary question on change will set encodedSituation',
              encodedSituation,
            )

            setSearchParams(encodedSituation, 'push', false)
          }}
        />
      </ClassicQuestionWrapper>
    )

  return (
    <ClassicQuestionWrapper
      {...{
        rule,
        nextQuestions,
        currentQuestion,
        rules,
        answeredQuestions,
        situation,
        setSearchParams,
        currentValue,
        engine,
      }}
    >
      <Input
        css={`
          border: 2px solid #dfdff1 !important;
          border-radius: 0.3rem !important;
          box-shadow: none !important;
          background: white !important;
          width: 6rem !important;
          height: 2.8rem !important;
          outline: none;
        `}
        type={ruleQuestionType}
        placeholder={evaluation.nodeValue}
        value={currentValue == null ? '' : currentValue}
        name={currentQuestion}
        unit={evaluation.unit}
        onChange={(value) => {
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
          console.log(
            'on change will set encodedSituation',
            encodedSituation,
            situation,
          )

          setSearchParams(encodedSituation, 'replace', false)
        }}
      />
    </ClassicQuestionWrapper>
  )
}
