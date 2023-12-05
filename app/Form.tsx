'use client'
import rules from './règles.yaml'

import getNextQuestions from '@/components/publicodes/getNextQuestions'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
  validValueMark,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import { useState } from 'react'
import {
  AnswerWrapper,
  FormButtonsWrapper,
  FormLinkButton,
  Input,
  InputWrapper,
} from '@/components/InputUI'
import Suggestions from './Suggestions'
import Link from '@/node_modules/next/link'
import css from '@/components/css/convertToJs'
import Personas from './Personas'

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
  const currentValue = situation[currentQuestion]
  console.log('currentQuestion', currentQuestion, currentValue)
  const defaultValue = currentQuestion && engine.evaluate(currentQuestion)

  return (
    <div>
      <div>
        <Personas setSearchParams={setSearchParams} />
        <h2>Votre aide </h2>
        <p>
          <em>Ma Prime Rénov + montant indicatif CEE.</em>
        </p>
        <div>
          Estimation {currentQuestion ? '' : ' finale'}&nbsp;: {value}
        </div>
        {currentQuestion && <div>Estimation intéractive&nbsp;: {newValue}</div>}
      </div>
      {rule && (
        <div>
          <h2>Question</h2>
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
              <Input
                type="number"
                placeholder={defaultValue.nodeValue}
                value={currentValue == null ? '' : currentValue}
                name={currentQuestion}
                onChange={(e) => {
                  const encodedSituation = encodeSituation(
                    {
                      ...situation,
                      [currentQuestion]: e.target.value,
                    },
                    false,
                    answeredQuestions,
                  )
                  console.log(
                    'on change will set encodedSituation',
                    encodedSituation,
                  )

                  setSearchParams(encodedSituation, false, false)
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
        <p>⭐️ Vous avez terminé.</p>
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
    </div>
  )
}
