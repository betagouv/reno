import { Suspense } from 'react'
import EligibilityEcoPTZ from '@/components/module/EligibilityEcoPTZ'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function ModuleEcoPTZ() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <EligibilityEcoPTZ
          {...{
            dottedName: 'PTZ',
          }}
        />
      </Suspense>
    </>
  )
}
