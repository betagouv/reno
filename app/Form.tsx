'use client'

import css from '@/components/css/convertToJs'
import Explications from '@/components/explications/Explications'
import InputSwitch, { getQuestionText } from '@/components/InputSwitch'
import { AnswerWrapper } from '@/components/InputUI'
import NextQuestions from '@/components/NextQuestions'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import questionType from '@/components/publicodes/questionType'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { getRuleName } from '@/components/publicodes/utils'
import Result, { Results } from '@/components/Result'
import { Card } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import FormButtons from './FormButtons'
import LinkAPI from './LinkAPI'
import Personas from './Personas'
import Suggestions from './Suggestions'
import simulationConfig from './simulationConfig.yaml'
import { QuestionHeader } from './QuestionHeader'
import { useMemo } from 'react'

export default function Form({ searchParams, rules }) {
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(searchParams, rules),
  ]

  const situation = {
      ...(simulationConfig.situation || {}),
      ...getSituation(searchParams, rules),
    },
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )
  console.log({ answeredQuestions, situation })
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
  const ruleQuestionType =
    currentQuestion &&
    questionType(engine.setSituation(situation).evaluate(currentQuestion), rule)
  const rawValue = situation[currentQuestion]
  const currentValue =
    rawValue && (ruleQuestionType === 'text' ? rawValue.slice(1, -1) : rawValue)

  console.log('eval', engine.evaluate('gestes . montant'))
  /*
  console.log(
    'currentQuestion',
    currentQuestion,
    currentValue,
    ruleQuestionType,
    nextQuestions,
  )
  */
  const ruleName = currentQuestion && getRuleName(currentQuestion)
  return (
    <div>
      <Personas setSearchParams={setSearchParams} />
      {rule && (
        <Card $background={`#f2f2f9`}>
          <div>
            <QuestionHeader>
              <h3>{getQuestionText(rule, currentQuestion, rules)}</h3>
              {rule.descriptionHtml && (
                <details>
                  <summary>ℹ️</summary>
                  <div
                    dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
                  />
                </details>
              )}
            </QuestionHeader>
            <AnswerWrapper>
              <Suggestions
                rule={rule}
                onClick={(value) =>
                  setSearchParams(
                    encodeSituation(
                      {
                        ...situation,
                        [currentQuestion]: value,
                      },
                      false,
                      answeredQuestions,
                    ),
                    true,
                    false,
                  )
                }
              />
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

              <FormButtons
                {...{
                  currentValue,
                  rules,
                  setSearchParams,
                  encodeSituation,
                  answeredQuestions,
                  currentQuestion,
                  situation,
                }}
              />
            </AnswerWrapper>
          </div>
        </Card>
      )}
      <NextQuestions {...{ nextQuestions, rules }} />
      {answeredQuestions.length > 0 && (
        <div
          style={css`
            margin-top: 1rem;
          `}
        >
          <Link href={'/'}>Recommencer</Link>
        </div>
      )}
      <div
        style={css`
          margin-top: 1vh;
        `}
      >
        <h2>Votre Prime Rénov'</h2>
        <Results>
          <Result
            key={'acc'}
            {...{
              engine: engine.setSituation(situation),
              isFinal: !currentQuestion,
              rules,
              dottedName: 'MPR . accompagnée',
            }}
          />
          <span>OU</span>
          <Result
            key={'non acc'}
            {...{
              engine: engine.setSituation(situation),
              isFinal: !currentQuestion,
              dottedName: 'MPR . non accompagnée',
              rules,
            }}
          />
        </Results>
      </div>
      <Explications {...{ engine, rules, situation }} />
      <LinkAPI searchParams={searchParams} />
    </div>
  )
}
