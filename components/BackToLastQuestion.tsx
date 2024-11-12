'use client'

import { useEffect, useState } from 'react'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'

import { encodeDottedName } from './publicodes/situationUtils'
import { omit, sortBy } from './utils'
import simulationConfig from '@/app/simulation/simulationConfig.yaml'

const questions = simulationConfig.prioritaires

export default function BackToLastQuestion({
  setSearchParams,
  situation,
  answeredQuestions,
}) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setUrl(decodeURIComponent(window.location.search))
  }, [])

  if (!url) return null

  const questionsPositions = Object.keys(situation)
    .map(
      (key) =>
        questions.includes(key) && [key, -url.indexOf(encodeDottedName(key))],
    )
    .filter(Boolean)

  const lastQuestionKey = sortBy(([_, index]) => index)(
    questionsPositions,
  )[0][0]

  return (
    <BtnBackToParcoursChoice
      {...{
        setSearchParams,
        situation: omit([lastQuestionKey], situation),
        answeredQuestions,
      }}
    />
  )
}
