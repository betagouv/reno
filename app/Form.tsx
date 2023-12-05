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
import Link from '@/node_modules/next/link'

const engine = new Publicodes(rules)
const questionsConfig = { prioritaires: [], 'non prioritaires': [] }

export default function Form({ searchParams }) {
  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  console.log({ answeredQuestions })

  const evaluation = engine.evaluate('aides'),
    value = formatValue(evaluation),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      questionsConfig,
    )
  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  const situation = getSituation(searchParams, rules)

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
            <input
              type="number"
              value={currentValue || defaultValue.nodeValue}
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
          </label>
          <Link
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
          </Link>
        </div>
      )}
      <div>
        <h3>Prochaines questions</h3>
        <ul>
          {nextQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
