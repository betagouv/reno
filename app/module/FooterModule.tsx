import ParFranceRénovTexte from '@/components/ParFranceRénovTexte'
import logo from '@/public/logo-service-de-FR.svg'
import Image from 'next/image'

export default function FooterModule() {
  return (
    <footer>
      <a
        className="fr-raw-link fr-col-6"
        href="https://mesaidesreno.beta.gouv.fr"
      >
        <Image
          src={logo}
          className="fr-responsive-img"
          style={{ maxWidth: '60%' }}
          alt="Logo Mes Aides Réno"
        />
      </a>
      <ParFranceRénovTexte />
    </footer>
  )
}
