import Footer from '@/components/Footer'
import { Suspense } from 'react'
import Personas from '../Personas'
import Tests from './Tests'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Personas- Mes aides réno',
  description:
    "Choisissez l'un des personas pour explorer les résultats de simulation d'une variété de profils types",
}

export default function PersonasPage() {
  return (
    <Suspense>
      <Personas />
      <Tests />
      <Footer />
    </Suspense>
  )
}
