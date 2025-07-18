import React from 'react'
import Image from 'next/image'
import GesteQuestion from './../GesteQuestion'
import mprImage from '@/public/maprimerenov.svg'
import { BlocAide, MiseEnAvant, PrimeStyle } from '../UI'
import { getAnsweredQuestions } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import Value from '../Value'
import { push } from '@socialgouv/matomo-next'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import Badge from '@codegouvfr/react-dsfr/Badge'

export const BlocAideMPR = ({
  infoMPR,
  rules,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
  display = 'top',
}) => {
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  // On affiche les questions répondues, mais pas celles validées (sinon elles s'affichent lors du parcours par geste)
  const questionsAnswered = Object.keys(situation).filter(
    (q) =>
      infoMPR.questions.includes(q) &&
      !getAnsweredQuestions(situationSearchParams, rules).includes(q),
  )

  let lastQuestionAnswered = -1
  for (let i = infoMPR.questions.length - 1; i >= 0; i--) {
    if (questionsAnswered.includes(infoMPR.questions[i])) {
      lastQuestionAnswered = i
      break
    }
  }

  const currentQuestion = infoMPR.questions[lastQuestionAnswered + 1]
  const isExactTotal =
    Array.isArray(infoMPR.questions) &&
    infoMPR.questions.every((question) => question in situation)
  const isEligible = infoMPR.montant !== 'Non applicable'
  if (isEligible && isExactTotal) {
    push(['trackEvent', 'Module', 'Interaction', 'Affiche Resultat'])
  }

  return (
    <BlocAide>
      <div className="aide-header">
        <Image src={mprImage} alt="logo ma prime renov" width="100" />
        <div>
          {display === 'top' && (
            <PrimeStyle>
              {'Prime de '}
              <strong>{infoMPR.montant}</strong>
            </PrimeStyle>
          )}
          <h2>{display !== 'top' ? "Calculateur d'aide" : ''} MaPrimeRénov'</h2>
        </div>
      </div>
      <div className="aide-details">
        {infoMPR.questions
          .slice(0, lastQuestionAnswered + 1)
          .map((question, index) => (
            <GesteQuestion
              key={index}
              {...{
                rules,
                question,
                engine,
                situation,
                setSearchParams,
                answeredQuestions,
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
              answeredQuestions,
            }}
          />
        )}
        {display == 'bottom' && (
          <>
            <div
              css={`
                justify-content: end;
                display: flex;
              `}
            >
              <Badge noIcon severity={isEligible && 'success'}>
                {isEligible ? (
                  <>Prime de {isExactTotal ? infoMPR.montant : '...'}</>
                ) : (
                  <>Non Éligible</>
                )}
              </Badge>
            </div>
            <AvanceTMO {...{ engine, situation }} />
          </>
        )}
        {display === 'top' && (
          <div className="details">
            <AvanceTMO {...{ engine, situation }} />
            Précisions:
            <ul>
              <li>
                La prestation doit être inférieure à{' '}
                <strong>{infoMPR.plafond}</strong>
              </li>
              <li>
                Sous condition de recours à un professionnel{' '}
                <strong>RGE</strong>
              </li>
              {rules[infoMPR.dottedName]?.description && (
                <li>{rules[infoMPR.dottedName].description}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </BlocAide>
  )
}

export const AvanceTMO = ({ engine, situation }) => {
  const ménageClasse = engine.evaluate('ménage . revenu . classe').nodeValue
  const isEligible =
    engine.evaluate('ménage . revenu').nodeValue != 0 &&
    ménageClasse === 'très modeste'
  if (!isEligible) {
    return null
  }

  return (
    <Alert
      className="fr-my-5v"
      description={
        <p>
          En tant que ménage au revenu <strong>{ménageClasse}</strong>
          , vous pourrez bénéficier d'une avance allant jusqu'à
          <Value
            {...{
              engine,
              situation,
              dottedName: 'gestes . pourcentage avance',
              state: 'none',
            }}
          />
          de la part de MaPrimeRénov' (par gestes). Le reste sera remboursé
          après travaux.
        </p>
      }
      onClose={function noRefCheck() {}}
      severity="info"
      small
    />
  )
}
