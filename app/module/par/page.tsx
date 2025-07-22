import { Suspense } from 'react'
import EligibilityPAR from '@/components/module/EligibilityPAR'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function ModulePAR() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <EligibilityPAR
          {...{
            dottedName: 'PAR',
          }}
        />
      </Suspense>
    </>
  )
}
