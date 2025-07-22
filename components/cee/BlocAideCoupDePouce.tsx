import React, { useEffect } from 'react'
import Image from 'next/image'
import GesteQuestion from '../GesteQuestion'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import { BlocAide } from '../UI'
import { getAnsweredQuestions } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { push } from '@socialgouv/matomo-next'

export const BlocAideCoupDePouce = ({
  infoCoupDePouce,
  rules,
  engine,
  situation,
  setSearchParams,
  displayPrime = 'top',
}) => {
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  // On n'affiche pas les questions validées (sinon elles s'affichent lors du parcours par geste)
  const questionsAnswered = Object.keys(situation).filter(
    (q) =>
      infoCoupDePouce.questions.includes(q) &&
      !getAnsweredQuestions(situationSearchParams, rules).includes(q),
  )

  let lastQuestionAnswered = -1
  for (let i = infoCoupDePouce.questions.length - 1; i >= 0; i--) {
    if (questionsAnswered.includes(infoCoupDePouce.questions[i])) {
      lastQuestionAnswered = i
      break
    }
  }
  const currentQuestion = infoCoupDePouce.questions[lastQuestionAnswered + 1]

  const isExactTotal =
    Array.isArray(infoCoupDePouce.questions) &&
    infoCoupDePouce.questions.every((question) => question in situation)
  const isEligible =
    infoCoupDePouce.isEligible && infoCoupDePouce.montant != 'Non applicable'
  if (isEligible && isExactTotal) {
    push(['trackEvent', 'Module', 'Interaction', 'Affiche Resultat'])
  }

  const remplacementChaudiere =
    rules['CEE . projet . remplacement chaudière thermique'].titre

  return (
    <BlocAide>
      <div className="aide-header">
        <Image src={coupDePouceImage} alt="logo Coup de Pouce" width="100" />
        <div>
          {displayPrime === 'top' &&
            (infoCoupDePouce.montant === 'Non applicable' ? (
              <Badge>Non applicable sans {remplacementChaudiere}</Badge>
            ) : (
              <Badge>
                Prime de {infoCoupDePouce.montant} si {remplacementChaudiere}
              </Badge>
            ))}
          <h3>Prime Coup de pouce</h3>
        </div>
      </div>
      <div className="aide-details">
        {infoCoupDePouce.questions
          .slice(0, lastQuestionAnswered + 1)
          .map((question, idx) => (
            <GesteQuestion
              key={idx}
              {...{
                rules,
                question,
                engine,
                situation,
                setSearchParams,
              }}
            />
          ))}
        {currentQuestion && (
          <GesteQuestion
            {...{
              rules,
              question: currentQuestion,
              engine,
              situation,
              setSearchParams,
            }}
          />
        )}
        {displayPrime === 'bottom' && (
          <div
            style={{
              justifyContent: 'end',
              display: 'flex',
            }}
          >
            <Badge
              noIcon
              severity={isEligible ? 'success' : 'default'}
              className="fr-text--lead"
            >
              {isEligible ? (
                <>Prime de {isExactTotal ? infoCoupDePouce.montant : '...'}</>
              ) : (
                <>Non Éligible</>
              )}
            </Badge>
          </div>
        )}
      </div>
    </BlocAide>
  )
}
