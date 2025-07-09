import { Suspense } from 'react'
import EligibilityTaxeFonciere from '@/components/module/EligibilityTaxeFonciere'

export default function ModuleTaxeFonciere() {
  return (
    <Suspense>
      <EligibilityTaxeFonciere
        {...{
          dottedName: 'taxe foncière',
        }}
      />
    </Suspense>
  )
}
