import { Suspense } from 'react'
import EligibilityTaxeFonciere from '@/components/module/EligibilityTaxeFonciere'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export default function ModuleTaxeFonciere() {
  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <EligibilityTaxeFonciere
          {...{
            dottedName: 'taxe foncière',
          }}
        />
      </Suspense>
    </>
  )
}
