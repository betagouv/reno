import { Suspense } from 'react'
import PlusValueModule from '@/components/module/PlusValueModule'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function Integration() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <PlusValueModule type="module" />
      </Suspense>
    </>
  )
}
