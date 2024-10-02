import React from 'react'
import Image from 'next/image'
import GesteQuestion from './../GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import { BlocAide, PrimeStyle } from '../UI'
import { getAnsweredQuestions } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'

export const BlocAideMPR = ({ infoMPR, rules, engine, situation, answeredQuestions, setSearchParams, displayPrime="top" }) => {

  const rawSearchParams = useSearchParams(),
  situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  // On affiche les questions répondues, mais pas celles validées (sinon elles s'affichent lors du parcours par geste)
  const questionsAnswered = Object.keys(situation)
                                  .filter(q => infoMPR.questions.includes(q) && !getAnsweredQuestions(situationSearchParams, rules).includes(q))

  let lastQuestionAnswered = -1;
  for (let i = infoMPR.questions.length - 1; i >= 0; i--) {  
    if (questionsAnswered.includes(infoMPR.questions[i])) {
        lastQuestionAnswered = i;
        break;
    }
  }

  const currentQuestion = infoMPR.questions[lastQuestionAnswered+1];
  const isExactTotal =  Array.isArray(infoMPR.questions) && infoMPR.questions.every(question => question in situation)
  const isEligible = infoMPR.montant !== "Non applicable"
  
  return (
        <BlocAide>
          <div className="aide-header">
            <Image src={mprImage} alt="logo ma prime renov" width="100" />
              <div>
                {displayPrime === "top" && (
                  <PrimeStyle>
                    {'Prime de '}
                    <strong>{infoMPR.montant}</strong>
                  </PrimeStyle>
                )}
                <h3>{displayPrime !== "top" ? "Calculateur d'aide" : ""} MaPrimeRénov'</h3>
              </div>
          </div>
          <div className="aide-details">
            {infoMPR.questions.slice(0, lastQuestionAnswered+1).map((question, index) => (
                <GesteQuestion
                    key={index}
                    {...{
                      rules,
                      question,
                      engine,
                      situation,
                      setSearchParams,
                      answeredQuestions
                    }}
                />
            ))}
            {currentQuestion && (
              <GesteQuestion {... {
                  rules,
                  question: currentQuestion,
                  engine,
                  situation,
                  setSearchParams,
                  answeredQuestions
                }}
              />
            )}
            {displayPrime == "bottom" && (
              <div css={`justify-content: end;display: flex;`}>
                <PrimeStyle css={`padding: 0.75rem;`} $inactive={!isEligible}>
                  {isEligible ?
                      (<>Prime de <strong css={`font-size: 1.5rem;`}>{isExactTotal ? infoMPR.montant : "..."}</strong></>) :
                      (<strong css={`font-size: 1.25rem;`}>Non Éligible</strong>)
                  }
                </PrimeStyle>
              </div>
            )}
            {displayPrime === "top" && (
              <div className="details">
                  Précisions:
                  <ul>
                    <li>La prestation doit être inférieure à <strong>{infoMPR.plafond}</strong></li>
                    <li>Sous condition de recours à un professionnel <strong>RGE</strong></li>
                  </ul>
              </div>
            )}
          </div>
        </BlocAide>
    )
}