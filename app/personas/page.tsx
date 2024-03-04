import Footer from '@/components/Footer'
import { Suspense } from 'react'
import Personas from '../Personas'
import Tests from './Tests'

export default function PersonasPage() {
  return (
    <Suspense>
      <Personas />
      <Tests />
      <Footer />
    </Suspense>
  )
}
