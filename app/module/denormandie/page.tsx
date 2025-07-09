import { Suspense } from 'react'
import EligibilityDenormandie from '@/components/module/EligibilityDenormandie'

export default function ModuleDenormandie() {
  return (
    <Suspense>
      <EligibilityDenormandie
        {...{
          dottedName: 'denormandie',
        }}
      />
    </Suspense>
  )
}
