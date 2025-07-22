import { Suspense } from 'react'
import FactureIntegration from './FactureIntegration'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export default function Integration() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense fallback={<div>Loading...</div>}>
        <FactureIntegration />
      </Suspense>
    </>
  )
}
