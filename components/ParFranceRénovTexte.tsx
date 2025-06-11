import { useMediaQuery } from 'usehooks-ts'
export default function ParFranceRénovTexte() {
  const isMobile = useMediaQuery('(max-width: 400px)')

  return (
    <small>
      Mes Aides Réno est un service public de France&nbsp;Rénov{"'"}
      {isMobile
        ? '.'
        : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
    </small>
  )
}
