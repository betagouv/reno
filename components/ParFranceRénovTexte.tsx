import { useMediaQuery } from 'usehooks-ts'
export default function ParFranceRénovTexte() {
  const isMobile = useMediaQuery('(max-width: 400px)')

  return (
    <small>
      Une initiative construite avec France&nbsp;Rénov{"'"}
      {isMobile
        ? '.'
        : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
    </small>
  )
}
