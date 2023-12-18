'use client'
import rules from './rules'

import css from '@/components/css/convertToJs'
import InputSwitch from '@/components/InputSwitch'
import {
  AnswerWrapper,
  FormButtonsWrapper,
  FormLinkButton,
} from '@/components/InputUI'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import questionType from '@/components/publicodes/questionType'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from '@/node_modules/next/link'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import Personas from './Personas'
import Suggestions from './Suggestions'
import Result, { Results } from '@/components/Result'
import DifferentialResult from '@/components/DifferentialResult'
import NextQuestions from '@/components/NextQuestions'
import Explications from '@/components/explications/Explications'
import { Card } from '@/components/UI'

const engine = new Publicodes(rules)
const questionsConfig = { prioritaires: [], 'non prioritaires': [] }

export default function Form({ searchParams }) {
  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  console.log({ answeredQuestions })

  const situation = getSituation(searchParams, rules),
    validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) =>
        answeredQuestions.includes(k),
      ),
    )
  const evaluation = engine.setSituation(validatedSituation).evaluate('aides'),
    value = formatValue(evaluation),
    newEvaluation = engine.setSituation(situation).evaluate('aides'),
    newValue = formatValue(newEvaluation),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      questionsConfig,
    )
  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  const setSearchParams = useSetSearchParams()
  const ruleQuestionType =
    currentQuestion && questionType(engine.evaluate(currentQuestion))
  const rawValue = situation[currentQuestion]
  const currentValue =
    rawValue && (ruleQuestionType === 'text' ? rawValue.slice(1, -1) : rawValue)

  console.log(
    'currentQuestion',
    currentQuestion,
    currentValue,
    ruleQuestionType,
    nextQuestions,
  )
  return (
    <div>
      <Personas setSearchParams={setSearchParams} />
      {rule && (
        <Card>
          <label>
            <div>{rule.question}</div>
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
                  currentValue,
                  currentQuestion,
                  situation,
                  answeredQuestions,
                  setSearchParams,
                  engine,
                }}
              />

              <FormButtonsWrapper>
                {currentValue != null && (
                  <FormLinkButton
                    href={setSearchParams(
                      encodeSituation(
                        {
                          ...situation,
                          [currentQuestion]: situation[currentQuestion],
                        },
                        false,
                        [...answeredQuestions, currentQuestion],
                      ),
                      true,
                      false,
                    )}
                  >
                    Suivant
                  </FormLinkButton>
                )}
              </FormButtonsWrapper>
            </AnswerWrapper>
          </label>
        </Card>
      )}
      <DifferentialResult
        {...{
          value: evaluation.nodeValue,
          newValue: newEvaluation.nodeValue,
          currentQuestion,
        }}
      />
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
            {...{
              value,
              isFinal: !currentQuestion,
              rule: rules['MPR . accompagnée'],
            }}
          />
          <Result
            {...{
              value,
              isFinal: !currentQuestion,
              rule: rules['MPR . accompagnée'],
            }}
          />
        </Results>
      </div>
      <Explications {...{ engine, rules, situation }} />
    </div>
  )
}
