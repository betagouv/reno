import { Suspense } from 'react'
import TravauxIntegration from './TravauxIntegration'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export default function Integration() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense fallback={<div>Chargement...</div>}>
        <TravauxIntegration />
      </Suspense>
    </>
  )
}
