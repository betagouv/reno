import { Suspense } from 'react'
import Ampleur from '../Ampleur'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function Integration() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <Ampleur type="module" />
      </Suspense>
    </>
  )
}
