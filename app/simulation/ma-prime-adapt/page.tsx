import MaPrimeAdapt from '@/components/maPrimeAdapt/MaPrimeAdapt'
import { Metadata } from 'next'
import { Suspense } from 'react'

const description = `Calculez les aides Ma Prime Adapt pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides rénovation MaPrimeAdapt 2024',
  description,
  alternates: {
    canonical: '/ma-prime-aapt',
  },
}

export default function Page() {
  return (
    <Suspense>
      <MaPrimeAdapt />
    </Suspense>
  )
}
