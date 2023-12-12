'use client'
import rules from './règles.yaml'

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
import Result from '@/components/Result'
import DifferentialResult from '@/components/DifferentialResult'

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
        <div>
          <h2>Questions</h2>
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
        </div>
      )}
      <DifferentialResult
        {...{
          value: evaluation.nodeValue,
          newValue: newEvaluation.nodeValue,
          currentQuestion,
        }}
      />
      {nextQuestions.length ? (
        <div>
          <h3>Prochaines questions</h3>
          <ol>
            {nextQuestions.slice(1).map((question) => (
              <li key={question}>{rules[question].titre}</li>
            ))}
          </ol>
        </div>
      ) : (
        <p
          style={css`
            margin: 1rem 0;
          `}
        >
          ⭐️ Vous avez terminé.
        </p>
      )}
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
          margin-top: 2rem;
        `}
      >
        <h2>Votre aide </h2>
        <p>
          <em>Ma Prime Rénov + estimation CEE.</em>
        </p>
        <Result value={value} currentQuestion={currentQuestion} />
      </div>
    </div>
  )
}
