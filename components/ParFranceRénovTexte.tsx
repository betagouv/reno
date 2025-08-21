'use client'
import useIsMobile from './useIsMobile'
export default function ParFranceRénovTexte() {
  const isMobile = useIsMobile()

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
