'use client'

import { filterAidesToDisplay } from '@/components/ampleur/AmpleurSummary'
import { useAides } from '@/components/ampleur/useAides'
import { AmpleurAideSummary } from './AmpleurAideSummary'
import AmpleurCTA from './AmpleurCTA'
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
      <div className="fr-callout fr-callout--yellow-moutarde">
        <h2>⏳️ En attente de résultats</h2>
        <div>
          <p>
            Répondez aux questions ci-dessus pour afficher vos aides
            💶&nbsp;&nbsp;💶
          </p>
        </div>
      </div>
    )
  push(['trackEvent', 'Module', 'Interaction', 'Affiche Resultat'])
  return (
    <div className="fr-callout fr-callout--blue-cumulus">
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
        <p className="fr-hint-text fr-mt-3v">
          Pour bénéficier des aides du parcours accompagné, des gains
          énergétiques seront à réaliser, par exemple un saut d'au moins 2
          classes de DPE, soit passer du DPE actuel{' '}
          <DPELabel index={currentDPE - 1} /> à un DPE{' '}
          <DPELabel index={targetDPE - 1} />.
        </p>
      )}
    </div>
  )
}
