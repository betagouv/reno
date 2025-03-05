import { Suspense } from 'react'
import EligibilityPAR from '@/components/module/EligibilityPAR'

export default function ModulePAR() {
  return (
    <Suspense>
      <EligibilityPAR
        {...{
          dottedName: 'PAR',
        }}
      />
    </Suspense>
  )
}
