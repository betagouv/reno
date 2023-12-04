'use client'
import rules from './règles.yaml'

import Publicodes from 'publicodes'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useState } from 'react'

const engine = new Publicodes(rules)
const questionsConfig = { prioritaires: [], 'non prioritaires': [] }

export default function Form() {
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const evaluation = engine.evaluate('aides'),
    value = formatValue(evaluation),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      questionsConfig,
    )

  return (
    <div>
      {value}
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
