import { Suspense } from 'react'
import EligibilityDenormandie from '@/components/module/EligibilityDenormandie'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function ModuleDenormandie() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <EligibilityDenormandie
          {...{
            dottedName: 'denormandie',
          }}
        />
      </Suspense>
    </>
  )
}
