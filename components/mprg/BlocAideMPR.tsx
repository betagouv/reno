import React from 'react'
import Image from 'next/image'
import GesteQuestion from './../GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import { BlocAide, PrimeStyle } from '../UI'
import { getAnsweredQuestions } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'

export const BlocAideMPR = ({ infoMPR, rules, engine, situation }) => {

  const rawSearchParams = useSearchParams(),
  situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  const validatedQuestion = getAnsweredQuestions(situationSearchParams, rules)

  // On affiche les questions répondues, mais pas celles validées (sinon elles s'affichent lors du parcours par geste)
  const questionsAnswered = Object.keys(situation)
                                  .filter(value => infoMPR.questions.includes(value))
                                  .filter(value => !validatedQuestion.includes(value))

  const currentQuestion = infoMPR.questions[questionsAnswered.length];
  return (
        <BlocAide>
          <div className="aide-header">
            <Image src={mprImage} alt="logo ma prime renov" width="100" />
            <div>
              <PrimeStyle>
                {'Prime de '}
                <strong>{infoMPR.montant}</strong>
              </PrimeStyle>
              <h3>MaPrimeRénov'</h3>
            </div>
          </div>
          <div className="aide-details">
            {questionsAnswered.map((question, index) => (
                <GesteQuestion
                    key={index}
                    {...{
                      rules,
                      question,
                      engine,
                      situation
                    }}
                />
            ))}
            {currentQuestion && (
              <GesteQuestion {... {
                  rules,
                  question: currentQuestion,
                  engine,
                  situation
                }}
              />
            )}
            <p className="details">
                Conditions: La prestation doit être inférieure à{' '}
                <strong>{infoMPR.plafond}</strong>.
            </p>
          </div>
        </BlocAide>
    )
}