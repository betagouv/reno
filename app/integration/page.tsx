import Integration from '@/components/Integration'
import { StartDsfrOnHydration } from '@codegouvfr/react-dsfr/next-app-router/DsfrProvider'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { Suspense } from 'react'

export const description = `Vous pouvez intégrer le simulateur Mes Aides Réno sur votre site Web en trois clics.`

export const metadata: Metadata = {
  title: 'Intégrer le simulateur Mes Aides Réno',
  description,
  openGraph: { images: ['/iframe.png'] },
}

export default function Page() {
  return (
    <Suspense>
      <StartDsfrOnHydration />
      <Integration />
    </Suspense>
  )
}
