import { Suspense } from 'react'
import EligibilityEcoPTZ from '@/components/module/EligibilityEcoPTZ'

export default function ModuleEcoPTZ() {
  return (
    <Suspense>
      <EligibilityEcoPTZ
        {...{
          dottedName: 'PTZ',
        }}
      />
    </Suspense>
  )
}
