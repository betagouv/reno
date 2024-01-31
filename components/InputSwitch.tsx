import AddressSearch from './AddressSearch'
import BinaryQuestion from './BinaryQuestion'

import BooleanMosaic, { isMosaicQuestion } from './BooleanMosaic'
import ClassicQuestionWrapper from './ClassicQuestionWrapper'

import DPESelector from './DPESelector'
import GestesMosaic, { isGestesMosaicQuestion } from './GestesMosaic'
import Input from './Input'
import MPRSelector from './MPRSelector'
import questionType from './publicodes/questionType'
import { encodeSituation } from './publicodes/situationUtils'
import RadioQuestion from './RadioQuestion'
import RhetoricalQuestion from './RhetoricalQuestion'
import ScenariosSelector from './ScenariosSelector'
import SmartInput from './SmartInput'

export default function InputSwitch({
  rule,
  currentValue,
  currentQuestion,
  situation,
  answeredQuestions,
  setSearchParams,
  engine,
  rules,
  ruleQuestionType,
}) {
  const evaluation = currentQuestion && engine.evaluate(currentQuestion)

  if (rule['bornes intelligentes'])
    return (
      <ClassicQuestionWrapper
        {...{
          rule,
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
  if (currentQuestion === 'ménage . région')
    return (
      <ClassicQuestionWrapper
        {...{
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
  if (['DPE . visé', 'travaux'].includes(currentQuestion))
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
  if (['MPR . choix'].includes(currentQuestion))
    return (
      <MPRSelector
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

  const gestesMosaic = isGestesMosaicQuestion(currentQuestion, rule, rules)
  if (gestesMosaic)
    return (
      <GestesMosaic
        {...{
          rules,
          rule,
          engine,
          situation,
          answeredQuestions,
          setSearchParams,
          questions: gestesMosaic,
        }}
      />
    )
  // We kept the latter component before it got really specialized. TODO not completely functional
  const mosaic = isMosaicQuestion(currentQuestion, rule, rules)
  if (mosaic)
    return (
      <ClassicQuestionWrapper
        {...{
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
        value={currentValue == null ? '' : currentValue}
        name={currentQuestion}
        onChange={(value) => {
          const encodedSituation = encodeSituation(
            {
              ...situation,
              [currentQuestion]:
                ruleQuestionType === 'number' ? value : `"${value}"`,
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
