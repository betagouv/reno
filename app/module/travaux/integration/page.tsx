import { Suspense } from 'react'
import TravauxIntegration from './TravauxIntegration'
export default function Integration() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <TravauxIntegration />
    </Suspense>
  )
}
