'use client'

import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'

export default function BackToLastQuestion({
  setSearchParams,
  situation,
  answeredQuestions,
}) {
  return (
    <BtnBackToParcoursChoice
      {...{
        setSearchParams,
        situation,
        answeredQuestions: answeredQuestions.slice(0, -1),
      }}
    />
  )
}
