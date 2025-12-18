import Copropriete from '@/components/copropriete/Copropriete'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { Metadata } from 'next'
import { Suspense } from 'react'

const description = `Calculez les aides MaPrimeRénov' 2026 pour la rénovation de votre copropriété.`

export const metadata: Metadata = {
  title: "Aides rénovation MaPrimeRénov' Copropriété 2026",
  description,
  alternates: {
    canonical: '/copropriete',
  },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <Copropriete />
      </Suspense>
    </>
  )
}
