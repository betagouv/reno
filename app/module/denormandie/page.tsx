import { Suspense } from 'react'
import EligibilityDenormandie from '@/components/module/EligibilityDenormandie'
import { FooterModule } from '../FooterModule'

export default function ModuleDenormandie() {
  return (
    <Suspense>
      <EligibilityDenormandie
        {...{
          dottedName: 'denormandie',
        }}
      />
      <FooterModule />
    </Suspense>
  )
}
