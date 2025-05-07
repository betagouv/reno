import {
  Explication,
  getQuestions,
  MontantPrimeTravaux,
} from './DPETravauxModule'
import { MiseEnAvant } from '@/components/UI'
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
      <MiseEnAvant>
        <Explication geste="ampleur" dpe={dpe} xml={xml} />
      </MiseEnAvant>
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
