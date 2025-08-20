'use client'
import { useMediaQuery } from 'usehooks-ts'
export default function ParFranceRénovTexte() {
  const isMobile = useMediaQuery('(max-width: 400px)')

  return (
    <p className="fr-hint-text fr-mb-0">
      Mes Aides Réno est un service public de{' '}
      <a
        rel="noopener external"
        href="https://france-renov.gouv.fr"
        target="_blank"
      >
        France&nbsp;Rénov'
      </a>{' '}
      {isMobile
        ? '.'
        : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
    </p>
  )
}
