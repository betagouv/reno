'use client'

import useIsInIframe from '@/components/useIsInIframe'
import { push } from '@socialgouv/matomo-next'

export default function HomepageSteps() {
  const isInIFrame = useIsInIframe()
  if (isInIFrame) {
    push(['trackEvent', 'Iframe', 'Page', 'Home'])
  }
  return (
    !isInIFrame && (
      <ol
        className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center fr-my-5v"
        css={`
            li {
              display: flex;
              flex-direction: column;
              gap: 1em;
              flex-start;
              h3 {
                text-align: center;
              }
              strong {
                font-weight: 800;
                font-size: 300%;
                display: block;
                text-align: center;
              }
            }
          `}
      >
        <li className="fr-col-12 fr-col-md-4" key="1">
          <strong>1</strong>
          <h3>Je réponds à un questionnaire simplifié</h3>
          <p>
            6 questions pour évaluer votre éligibilité et estimer le montant le
            vos aides.
          </p>
        </li>
        <li className="fr-col-12 fr-col-md-4" key="2">
          <strong>2</strong>
          <h3>Je découvre le montant de mes aides</h3>
          <p>
            Et j’affine mon projet pour obtenir un montant d’enveloppe global
            pour mes travaux.
          </p>
        </li>
        <li className="fr-col-12 fr-col-md-4" key="3">
          <strong>3</strong>
          <h3>J’exporte le résultat de ma simulation</h3>
          <p>
            Pour le partager avec mon conseiller local France Rénov’, mes
            proches ou mes artisans.
          </p>
        </li>
      </ol>
    )
  )
}
