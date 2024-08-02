import React, { useEffect } from 'react'
import Image from 'next/image'
import GesteQuestion from '../GesteQuestion'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import { BlocAide, PrimeStyle } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'

export const BlocAideCoupDePouce = ({ infoCoupDePouce, rules, engine, situation, answeredQuestions, setSearchParams, displayPrime="top" }) => {

  const isExactTotal = infoCoupDePouce.questions.filter((q) => rules[q].question)
                                                .every(e => Object.keys(situation).includes(e))

  // Par défaut, on propose les valeurs max (cela sert aussi à sélectionner des valeurs dans les <select>)
  infoCoupDePouce.questions.map((q) => {
    if(!Object.keys(situation).includes(q) && rules[q].maximum) {
      situation[q] = rules[q].maximum
    }
  })

  const encodedSituation = encodeSituation(
    {
      ...situation,
    },
    false,
    answeredQuestions,
  )

  useEffect(() => {
    setSearchParams(encodedSituation, 'push', false)
  }, [encodedSituation, setSearchParams])

  return (
    <BlocAide>
      <div className="aide-header">
        <Image src={coupDePouceImage} alt="logo Coup de Pouce" width="100" />
        <div>
          {displayPrime === "top" && (
            infoCoupDePouce.montant === 'Non applicable' ? (
              <>
                <PrimeStyle $inactive={true}>
                  <strong>Non applicable</strong>
                </PrimeStyle>
                <span className="aide-details">
                  {' '}
                  sans {rules[infoCoupDePouce.questions].titre}
                </span>
              </>
            ) : (
              <>
                <PrimeStyle>
                  {'Prime de '}
                  <strong>{infoCoupDePouce.montant}</strong>
                </PrimeStyle>
                <span className="aide-details">{' '}si {rules[infoCoupDePouce.questions].titre}</span>
              </>
            )
          )}
          <h3>Prime Coup de pouce</h3>
        </div>
      </div>
      <div className="aide-details">
        {infoCoupDePouce.questions?.map((question, idx) => (
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
        {displayPrime === "bottom" && (
          <div css={`justify-content: end;display: flex;`}>
            <PrimeStyle css={`padding: 0.75rem;`}>
              {'Prime minimum de '}
              <strong css={`font-size: 1.5rem;`}>{isExactTotal ? infoCoupDePouce.montant : "???"}</strong>
            </PrimeStyle>
          </div>
        )}
      </div>
    </BlocAide>
  )
}