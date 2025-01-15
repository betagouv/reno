import { Suspense } from 'react'
import { FooterModule } from '../FooterModule'
import EligibilityTaxeFonciere from '@/components/module/EligibilityTaxeFonciere'

export default function ModuleTaxeFonciere() {
  return (
    <Suspense>
      <EligibilityTaxeFonciere
        {...{
          dottedName: 'taxe foncière',
        }}
      />
      <FooterModule />
    </Suspense>
  )
}
