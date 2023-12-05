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
import { FormLinkButton, Input, InputWrapper } from '@/components/InputUI'

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
        <h2>Résultat calcul MPR + CEE</h2>
        {value}
      </div>
      {rule && (
        <div>
          <h2>Question</h2>
          <label>
            <div>{rule.question}</div>
            <InputWrapper>
              <Input
                type="number"
                value={
                  currentValue != null ? currentValue : defaultValue.nodeValue
                }
                name={currentQuestion}
                onChange={(e) =>
                  setSearchParams(
                    encodeSituation(
                      {
                        ...situation,
                        [currentQuestion]: e.target.value,
                      },
                      false,
                      answeredQuestions,
                    ),
                    false,
                    false,
                  )
                }
              />
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
            </InputWrapper>
          </label>
        </div>
      )}
      <div>
        <h3>Prochaines questions</h3>
        <ul>
          {nextQuestions.slice(1).map((question) => (
            <li key={question}>{rules[question].titre}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
