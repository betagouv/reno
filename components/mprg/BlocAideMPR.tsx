import React from 'react'
import Image from 'next/image'
import GesteQuestion from './../GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import { BlocAide, PrimeStyle } from '../UI'
export const BlocAideMPR = ({ infoMPR, rules, engine, situation, answeredQuestions, setSearchParams }) => {
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
            {infoMPR.questions?.map((question, idx) => (
                <GesteQuestion
                    key={idx}
                    {...{
                    rules,
                    question,
                    engine,
                    situation,
                    answeredQuestions,
                    setSearchParams,
                    }}
                />
            ))}
            <p className="details">
                Conditions: La prestation doit être inférieure à{' '}
                <strong>{infoMPR.plafond}</strong>.
            </p>
          </div>
        </BlocAide>
    )
}