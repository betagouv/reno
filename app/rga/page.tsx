import RGA from '@/components/rga/RGA'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { Metadata } from 'next'
import { Suspense } from 'react'

const description = `Testez votre éligibilité à la nouvelle aide contre le retrait-gonflement des argiles.`

export const metadata: Metadata = {
  title: 'Aides de prévention au retrait-gonflement des argiles',
  description,
  alternates: {
    canonical: '/rga',
  },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <RGA />
      </Suspense>
    </>
  )
}
