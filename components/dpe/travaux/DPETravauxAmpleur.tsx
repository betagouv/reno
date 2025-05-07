import { getQuestions, MontantPrimeTravaux } from './DPETravauxModule'
import GesteQuestion from '@/components/GesteQuestion'
import React from 'react'

export function DPETravauxAmpleur({
  dpe,
  xml,
  rules,
  engine,
  situation,
  setSearchParams,
}) {
  const questions = getQuestions('MPR . accompagnée', situation, engine)

  return (
    <>
      {questions.map((question, index) => (
        <GesteQuestion
          key={'ampleur' + index}
          {...{
            rules,
            question,
            engine,
            situation,
            setSearchParams,
          }}
        />
      ))}
      <MontantPrimeTravaux
        {...{
          questions,
          engine,
          rule: 'MPR . accompagnée',
          situation,
        }}
      />
    </>
  )
}
