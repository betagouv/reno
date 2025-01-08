'use client'
import { push } from '@socialgouv/matomo-next'
import { CTA } from './UI'

export default function FatConseillerCTA() {
  return (
    <CTA
      css={`
        padding: 1rem;
        text-wrap: wrap;
        text-align: center;
        width: 100%;
      `}
      $fontSize="normal"
      onClick={() =>
        push([
          'trackEvent',
          'Simulateur Principal',
          'Clic',
          'trouver conseiller',
        ])
      }
    >
      Trouver mon conseiller local
    </CTA>
  )
}
