'use client'
import { useMediaQuery } from 'usehooks-ts'
import { ExternalLink } from './UI'
export default function ParFranceRénovTexte() {
  const isMobile = useMediaQuery('(max-width: 400px)')

  return (
    <small>
      Mes Aides Réno est un service public de{' '}
      <ExternalLink href="https://france-renov.gouv.fr" target="_blank">
        France&nbsp;Rénov'
      </ExternalLink>{' '}
      {isMobile
        ? '.'
        : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
    </small>
  )
}
