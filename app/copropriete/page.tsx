import Copropriete from '@/components/copropriete/Copropriete'
import { Main, PageBlock } from '@/components/UI'
import { Metadata } from 'next'
import { Suspense } from 'react'

const description = `Calculez les aides MaPrimeRénov' 2025 pour la rénovation de votre copropriété.`

export const metadata: Metadata = {
  title: "Aides rénovation MaPrimeRénov' Copropriété 2025",
  description,
  alternates: {
    canonical: '/copropriete',
  },
}

export default function Page() {
  return (
    <Suspense>
      <Copropriete />
    </Suspense>
  )
}
