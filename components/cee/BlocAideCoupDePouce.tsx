import React, { useEffect } from 'react'
import Image from 'next/image'
import GesteQuestion from '../GesteQuestion'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import { BlocAide, PrimeStyle } from '../UI'
import { encodeSituation, getAnsweredQuestions } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'

export const BlocAideCoupDePouce = ({ infoCoupDePouce, rules, engine, situation, answeredQuestions, setSearchParams, displayPrime="top" }) => {

  const rawSearchParams = useSearchParams(),
  situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  // On n'affiche pas les questions validées (sinon elles s'affichent lors du parcours par geste)
  const questionsToAnswer = infoCoupDePouce.questions.filter(q => !getAnsweredQuestions(situationSearchParams, rules).includes(q))
  const isExactTotal =  Array.isArray(infoCoupDePouce.questions) && infoCoupDePouce.questions.every(question => question in situation)
  const isEligible = infoCoupDePouce.isEligible
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
        {questionsToAnswer.map((question, idx) => (
          <GesteQuestion
            key={idx}
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
        {displayPrime === "bottom" && (
          <div css={`justify-content: end;display: flex;`}>
            <PrimeStyle css={`padding: 0.75rem;`} $inactive={!isEligible}>
              {isEligible ? (
                <>Prime de <strong css={`font-size: 1.5rem;`}>{isExactTotal ? infoCoupDePouce.montant : "..."}</strong></>
              ) : (
                <strong css={`font-size: 1.25rem;`}>Non Éligible</strong>
              )}
            </PrimeStyle>
          </div>
        )}
      </div>
    </BlocAide>
  )
}