'use client'
import rules from './règles.yaml'

import getNextQuestions from '@/components/publicodes/getNextQuestions'
import {
  encodeSituation,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Publicodes from 'publicodes'
import { useState } from 'react'

const engine = new Publicodes(rules)
const questionsConfig = { prioritaires: [], 'non prioritaires': [] }

export default function Form({ searchParams }) {
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  const evaluation = engine.evaluate('aides'),
    value = formatValue(evaluation),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      questionsConfig,
    )
  const currentQuestion = nextQuestions[0],
    rule = rules[currentQuestion]

  const situation = getSituation(searchParams, rules)

  const setSearchParams = useSetSearchParams()
  console.log('evaluation', evaluation)

  return (
    <div>
      <div>
        <h2>Résultat calcul MPR + CEE</h2>
        {value}
      </div>
      <div>
        <h2>Question</h2>
        <label>
          {currentQuestion}
          {rule.question}
          <input
            type="numeric"
            value={situation[currentQuestion]}
            onChange={(e) =>
              setSearchParams(
                encodeSituation({
                  ...situation,
                  [currentQuestion]: e.target.value,
                }),
              )
            }
          />
        </label>
      </div>
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
