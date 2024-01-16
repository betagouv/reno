'use client'

import Image from 'next/image'
import informationIcon from '@/public/information.svg'
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
import { Card, Section } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import FormButtons from './FormButtons'
import Share from './Share'
import Personas from '@/app/Personas'
import Suggestions from './Suggestions'
import simulationConfig from './simulationConfig.yaml'
import { QuestionHeader } from './QuestionHeader'
import { useMemo } from 'react'
import Notifications from '@/components/Notifications'
import Answers from './Answers'

export default function Form({ searchParams, rules }) {
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(searchParams, rules),
  ]
  const started = answeredQuestions.length > 1 // because of simulation mode

  const situation = {
      ...(simulationConfig.situation || {}),
      ...getSituation(searchParams, rules),
    },
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )
  console.log({ answeredQuestions, situation, started })
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

  return (
    <div>
      <Section>
        <Answers
          {...{ answeredQuestions, nextQuestions, currentQuestion, rules }}
        />
        {rule && (
          <Card $background={`#2a82dd1f`}>
            <div>
              {(!rule.type || !rule.type === 'question rhétorique') && (
                <QuestionHeader>
                  <h3>{getQuestionText(rule, currentQuestion, rules)}</h3>
                  {rule.descriptionHtml && (
                    <details>
                      <summary>
                        <Image
                          src={informationIcon}
                          width="25"
                          style={css`
                            vertical-align: bottom;
                          `}
                        />
                      </summary>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: rule.descriptionHtml,
                        }}
                      />
                    </details>
                  )}
                </QuestionHeader>
              )}
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
        <Notifications {...{ currentQuestion, engine }} />
      </Section>
      <Share searchParams={searchParams} />
    </div>
  )
}
