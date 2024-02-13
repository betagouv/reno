import Footer from '@/components/Footer'
import { Suspense } from 'react'
import Personas from '../Personas'

export default function PersonasPage() {
  return (
    <Suspense>
      <Personas />
      <Footer />
    </Suspense>
  )
}
