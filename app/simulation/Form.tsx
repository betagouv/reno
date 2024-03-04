'use client'

import InputSwitch from '@/components/InputSwitch'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import questionType from '@/components/publicodes/questionType'
import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { Section } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import Answers from './Answers'
import Share from './Share'
import simulationConfig from './simulationConfig.yaml'

export default function Form({ searchParams, rules }) {
  // this param lets us optionally build the form to target one specific publicode rule
  const { objectif, ...situationSearchParams } = searchParams

  const target = objectif ? decodeDottedName(objectif) : 'aides'

  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(situationSearchParams, rules),
  ]
  const started =
    answeredQuestions.filter((el) => el === 'simulation . mode').length > 1 // because of simulation mode

  const situation = {
      ...(simulationConfig.situation || {}),
      ...getSituation(situationSearchParams, rules),
    },
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )
  const evaluation = engine.setSituation(validatedSituation).evaluate(target),
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
              ruleQuestionType,
              nextQuestions,
              searchParams,
            }}
          />
        )}
      </Section>
      <br />
      <Share searchParams={searchParams} />
      <Section>
        <h2>Documentation</h2>
        <p>
          Si vous êtes experts, vous pouvez parcourir notre{' '}
          <Link
            href={
              '/documentation/MPR/?' +
              new URLSearchParams(situationSearchParams).toString()
            }
          >
            documentation complète du calcul
          </Link>
          .
        </p>
      </Section>
    </div>
  )
}
