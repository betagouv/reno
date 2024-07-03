import AddressSearch from './AddressSearch'
import BinaryQuestion from './BinaryQuestion'
import { decodeDottedName, encodeSituation } from './publicodes/situationUtils'

import BooleanMosaic, { isMosaicQuestion } from './BooleanMosaic'
import ClassicQuestionWrapper from './ClassicQuestionWrapper'

import { firstLevelCategory } from '@/app/simulation/Answers'
import DPESelector from './DPESelector'
import GestesBasket from './GestesBasket'
import GestesMosaic, {
  gestesMosaicQuestions,
  isGestesMosaicQuestion,
} from './GestesMosaic'
import Input from './Input'
import Eligibility from './Eligibility'
import RadioQuestion from './RadioQuestion'
import RhetoricalQuestion from './RhetoricalQuestion'
import ScenariosSelector from './ScenariosSelector'
import SmartInput from './SmartInput'
import questionType from './publicodes/questionType'

export default function InputSwitch({
  currentQuestion: givenCurrentQuestion,
  situation,
  answeredQuestions,
  setSearchParams,
  engine,
  rules,
  nextQuestions,
  searchParams,
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
        <SmartInput
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
  if (rule.type === 'question rhétorique')
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
        <RhetoricalQuestion
          {...{
            effect: () => setSearchParams({ [currentQuestion]: 'oui' }),
            situation,
            answeredQuestions,
            html: rule.descriptionHtml,
          }}
        />
      </ClassicQuestionWrapper>
    )

  if (currentQuestion === 'ménage . commune')
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
          questionsToSubmit: ['ménage . code région', 'ménage . code département', 'ménage . commune'],
          currentValue,
          engine,
        }}
      >
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
            },
            setSearchParams,
            situation,
            answeredQuestions,
          }}
        />
      </ClassicQuestionWrapper>
    )
  if (currentQuestion === 'logement . commune')
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
            setChoice: (result) => {
              const codeRegion = result.codeRegion
              const encodedSituation = encodeSituation(
                {
                  ...situation,
                  'logement . EPCI': `"${result.codeEpci}"`,
                  'logement . commune': `"${result.code}"`,
                  'logement . commune exonérée taxe foncière': result
                    .eligibilite.taxeFoncière
                    ? 'oui'
                    : 'non',
                  'logement . commune denormandie': result.eligibilite
                    .denormandie
                    ? 'oui'
                    : 'non',
                },
                false,
                answeredQuestions,
              )

              setSearchParams(encodedSituation, 'push', false)
            },
            setSearchParams,
            situation,
            answeredQuestions,
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

  if (firstLevelCategory(currentQuestion) === 'projet') {
    return (
      <ScenariosSelector
        {...{
          currentQuestion,
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
          rules,
        }}
      />
    )
  }

  if (["parcours d'aide"].includes(currentQuestion))
    return (
      <Eligibility
        {...{
          currentQuestion,
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
          rules,
          expanded: searchParams.details,
        }}
      />
    )

  const isGestesMosaic = isGestesMosaicQuestion(currentQuestion, rule, rules)
  if (isGestesMosaic)
    return (
      <GestesMosaic
        {...{
          rules,
          rule,
          engine,
          situation,
          answeredQuestions,
          setSearchParams,
          questions: gestesMosaicQuestions,
        }}
      />
    )

  if (
    currentQuestion === 'MPR . non accompagnée . confirmation' // ||
    //(currentQuestion.startsWith('gestes . ') && !gestesMosaicQuestions.includes(currentQuestion))
  ) {
    return (
      <GestesBasket
        {...{
          rules,
          rule,
          engine,
          situation,
          answeredQuestions,
          nextQuestions,
          setSearchParams,
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
        type={ruleQuestionType}
        placeholder={evaluation.nodeValue}
        value={currentValue == null ? "" : currentValue}
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
