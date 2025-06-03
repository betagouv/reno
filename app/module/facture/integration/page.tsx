import { Suspense } from 'react'
import FactureIntegration from './FactureIntegration'
export default function Integration() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FactureIntegration />
    </Suspense>
  )
}
