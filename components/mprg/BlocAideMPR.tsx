import React from 'react'
import Image from 'next/image'
import GesteQuestion from './../GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import { BlocAide, PrimeStyle } from '../UI'
import { getAnsweredQuestions } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'

export const BlocAideMPR = ({ infoMPR, rules, engine, situation, setSearchParams, displayPrime="top" }) => {

  const rawSearchParams = useSearchParams(),
  situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  const validatedQuestion = getAnsweredQuestions(situationSearchParams, rules)

  // On affiche les questions répondues, mais pas celles validées (sinon elles s'affichent lors du parcours par geste)
  const questionsAnswered = Object.keys(situation)
                                  .filter(value => infoMPR.questions.includes(value))
                                  .filter(value => !validatedQuestion.includes(value))

  const currentQuestion = infoMPR.questions[questionsAnswered.length];
  
  const isExactTotal = infoMPR.questions.filter((q) => rules[q].question)
                                        .every(e => Object.keys(situation).includes(e))
  const isEligible = infoMPR.montant !== "Non applicable"
  
  return (
        <BlocAide>
          <div className="aide-header">
            <Image src={mprImage} alt="logo ma prime renov" width="100" />
            {displayPrime == "top" && (
              <div>
                <PrimeStyle>
                  {'Prime de '}
                  <strong>{infoMPR.montant}</strong>
                </PrimeStyle>
                <h3>MaPrimeRénov'</h3>
              </div>
            )}
          </div>
          <div className="aide-details">
            {questionsAnswered.map((question, index) => (
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
            {displayPrime == "bottom" && (
              <div css={`justify-content: end;display: flex;`}>
                <PrimeStyle css={`padding: 0.75rem;`} $inactive={!isEligible}>
                  {isEligible ?
                      (<>Prime de <strong css={`font-size: 1.5rem;`}>{isExactTotal ? infoMPR.montant : "???"}</strong></>) :
                      (<strong css={`font-size: 1.25rem;`}>Non éligible</strong>)
                  }
                </PrimeStyle>
              </div>
            )}
            <p className="details">
                Conditions: La prestation doit être inférieure à{' '}
                <strong>{infoMPR.plafond}</strong>.
            </p>
          </div>
        </BlocAide>
    )
}