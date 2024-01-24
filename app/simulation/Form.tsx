'use client'

import css from '@/components/css/convertToJs'
import InputSwitch from '@/components/InputSwitch'
import Notifications from '@/components/Notifications'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import questionType from '@/components/publicodes/questionType'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { Card, Section } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import Answers from './Answers'
import ResultsBlock from './ResultsBlock'
import Share from './Share'
import simulationConfig from './simulationConfig.yaml'

export default function Form({ searchParams, rules }) {
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(searchParams, rules),
  ]
  const started =
    answeredQuestions.filter((el) => el === 'simulation . mode').length > 1 // because of simulation mode

  const situation = {
      ...(simulationConfig.situation || {}),
      ...getSituation(searchParams, rules),
    },
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )
  const evaluation = engine.setSituation(validatedSituation).evaluate('aides'),
    value = formatValue(evaluation),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      simulationConfig,
      rules,
    )
  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  const setSearchParams = useSetSearchParams()
  const liveEvaluation =
    currentQuestion && engine.setSituation(situation).evaluate(currentQuestion)

  const ruleQuestionType = currentQuestion && questionType(liveEvaluation, rule)

  const rawValue = situation[currentQuestion]
  const currentValue =
    rawValue && (ruleQuestionType === 'text' ? rawValue.slice(1, -1) : rawValue)

  return (
    <div>
      <Section>
        <Answers
          {...{
            answeredQuestions,
            nextQuestions,
            currentQuestion,
            rules,
            situation,
          }}
        />
        {rule && (
          <InputSwitch
            {...{
              rule,
              rules,
              currentValue,
              currentQuestion,
              situation,
              answeredQuestions,
              setSearchParams,
              engine,
            }}
          />
        )}
      </Section>
      <br />
      <Share searchParams={searchParams} />
    </div>
  )
}
