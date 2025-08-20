import ParFranceRénovTexte from '@/components/ParFranceRénovTexte'
import logo from '@/public/logo-service-de-FR.svg'
import Image from 'next/image'

export default function FooterModule() {
  return (
    <footer>
      <a className="fr-raw-link" href="https://mesaidesreno.beta.gouv.fr">
        <Image
          src={logo}
          className="fr-responsive-img"
          alt="Logo Mes Aides Réno, représentant une maison bleu blanc rouge ainsi que la marque à laquellee le service est rattaché, le visage souriant France Rénov' avec un toît en guise de couvre-chef."
        />
      </a>
      <ParFranceRénovTexte />
    </footer>
  )
}
