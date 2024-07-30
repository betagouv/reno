import React, { useState } from 'react'
import Image from 'next/image'
import GesteQuestion from './../GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import { BlocAide, PrimeStyle } from '../UI'
export const BlocAideMPR = ({ infoMPR, rules, engine, situation, answeredQuestions, setSearchParams }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestionIndexes, setAnsweredQuestionIndexes] = useState([]);

  const handleAnswer = () => {
    setAnsweredQuestionIndexes([...answeredQuestionIndexes, currentQuestionIndex]);
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  }
  const currentQuestion = infoMPR.questions[currentQuestionIndex];

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
            {answeredQuestionIndexes.map(index => (
              <GesteQuestion
                  key={index}
                  rules={rules}
                  question={infoMPR.questions[index]}
                  engine={engine}
                  situation={situation}
                  answeredQuestions={answeredQuestions}
                  setSearchParams={setSearchParams}
              />
            ))}
            {currentQuestion && (
              <GesteQuestion
                  key={currentQuestion.id || currentQuestionIndex} // Use unique identifier if available
                  rules={rules}
                  question={currentQuestion}
                  engine={engine}
                  situation={situation}
                  answeredQuestions={answeredQuestions}
                  setSearchParams={setSearchParams}
                  onAnswered={handleAnswer} // Trigger the next question display
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