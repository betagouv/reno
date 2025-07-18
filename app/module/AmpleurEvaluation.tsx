'use client'

import { filterAidesToDisplay } from '@/components/ampleur/AmpleurSummary'
import { useAides } from '@/components/ampleur/useAides'
import styled from 'styled-components'
import { AmpleurAideSummary } from './AmpleurAideSummary'
import AmpleurCTA from './AmpleurCTA'
import { CTA } from '@/components/UI'
import DPELabel from '@/components/dpe/DPELabel'
import { push } from '@socialgouv/matomo-next'

export function EvaluationValue({
  engine,
  situation,
  shouldDisplay,
  noDefaultSituation,
  currentDPE,
  targetDPE,
  disclaimer = true,
}) {
  engine.setSituation(situation)
  const aides = useAides(engine, situation)
  const aidesToDisplay = filterAidesToDisplay(aides)

  if (!shouldDisplay)
    return (
      <EvaluationValueWrapper className="fr-callout fr-callout--orange-terre-battue">
        <h2>⏳️ En attente de résultats</h2>
        <div>
          <p>
            Répondez aux questions ci-dessus pour afficher vos aides
            💶&nbsp;&nbsp;💶
          </p>
        </div>
      </EvaluationValueWrapper>
    )
  push(['trackEvent', 'Module', 'Interaction', 'Affiche Resultat'])
  return (
    <EvaluationValueWrapper className="fr-callout fr-callout--green-emeraude">
      <h2 className="fr-callout__title">🥳 Résultats</h2>
      <p className="fr-callout__text">Vous êtes éligible à :</p>
      <div className="fr-callout__text">
        <ol>
          {aidesToDisplay.slice(0, 3).map((aide) => {
            const text = aide.marque,
              text2 = aide['complément de marque']
            return (
              <li key={aide.dottedName}>
                <AmpleurAideSummary
                  key={aide.dottedName}
                  {...{
                    ...aide,
                    icon: aide.icône,
                    text,
                    text2,
                    situation,
                    type: aide.type,
                    expanded: true,
                    engine,
                  }}
                />
              </li>
            )
          })}
        </ol>
      </div>
      <AmpleurCTA {...{ situation: noDefaultSituation }} />
      {disclaimer && (
        <p className="fr-hint-text">
          Pour bénéficier des aides du parcours accompagné, des gains
          énergétiques seront à réaliser, par exemple un saut d'au moins 2
          classes de DPE, soit passer du DPE actuel{' '}
          <DPELabel index={currentDPE - 1} /> à un DPE{' '}
          <DPELabel index={targetDPE - 1} />.
        </p>
      )}
    </EvaluationValueWrapper>
  )
}
export const EvaluationValueWrapper = styled.div``
