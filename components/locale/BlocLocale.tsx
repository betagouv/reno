import React from 'react'
import Image from 'next/image'
import GesteQuestion from './../GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import { BlocAide, PrimeStyle } from '../UI'
import { getAnsweredQuestions } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'

export const BlocAideLocale = ({ info, rules, engine, situation, setSearchParams }) => {

  const rawSearchParams = useSearchParams(),
  situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  // On affiche les questions répondues, mais pas celles validées (sinon elles s'affichent lors du parcours par geste)
  const questionsAnswered = Object.keys(situation)
                                  .filter(q => info.questions.includes(q) && 
                                               !getAnsweredQuestions(situationSearchParams, rules).includes(q))
  
                                               let lastQuestionAnswered = -1;
  for (let i = info.questions.length - 1; i >= 0; i--) {  
    if (questionsAnswered.includes(info.questions[i])) {
        lastQuestionAnswered = i;
        break;
    }
  }
  
  const currentQuestion = info.questions[lastQuestionAnswered+1];
  
  const isExactTotal =  Array.isArray(info.questions) && info.questions.every(question => question in situation)
  const isEligible = info.montant !== "Non applicable"
  
  return (
    <BlocAide>
      <div className="aide-header">
        <h3>Calculateur des aides à la rénovation énergétique du Grand Narbonne</h3>
      </div>
      <div className="aide-details">
        {info.questions.slice(0, lastQuestionAnswered+1).map((question, index) => (
          <GesteQuestion
            key={index}
            {...{
              rules,
              question,
              engine,
              situation,
              setSearchParams
            }}
          />
        ))}
        {currentQuestion && (
          <GesteQuestion {... {
            rules,
            question: currentQuestion,
            engine,
            situation,
            setSearchParams
            }}
          />
        )}
        <div css={`justify-content: end;display: flex;`}>
          <PrimeStyle css={`padding: 0.75rem;`} $inactive={!isEligible}>
            {isEligible ?
                (<>Prime de <strong css={`font-size: 1.5rem;`}>{isExactTotal ? info.montant : "..."}</strong></>) :
                (<strong css={`font-size: 1.25rem;`}>Non Éligible</strong>)
            }
          </PrimeStyle>
        </div>
      </div>
    </BlocAide>
  )
}