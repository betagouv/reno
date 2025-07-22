import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import DevenirPartenaire from '@/components/DevenirPartenaire'
import illustrationAmpleur from '@/public/illuAmpleur.png'
import { StartDsfrOnHydration } from '@codegouvfr/react-dsfr/next-app-router/DsfrProvider'

export const metadata: Metadata = {
  title: 'Devenir Partenaire Mes Aides Réno',
  description: `Profitez de nos outils et process pour l'intégration des simulateurs Mes Aides Réno sur votre site Web.`,
  openGraph: { images: [illustrationAmpleur] },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <DevenirPartenaire />
    </>
  )
}
