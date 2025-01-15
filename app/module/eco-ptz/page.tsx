import { Suspense } from 'react'
import EligibilityEcoPTZ from '@/components/module/EligibilityEcoPTZ'
import { FooterModule } from '../FooterModule'

export default function ModuleEcoPTZ() {
  return (
    <Suspense>
      <EligibilityEcoPTZ
        {...{
          dottedName: 'PTZ',
        }}
      />
      <FooterModule />
    </Suspense>
  )
}
