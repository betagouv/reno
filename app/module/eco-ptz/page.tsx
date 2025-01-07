'use client'
import { Suspense } from 'react'
import EligibilityEcoPTZ from '@/components/module/EligibilityEcoPTZ'
import { FooterModule } from '../Ampleur'
import { AmpleurWrapper } from '../AmpleurUI'

export default function ModuleEcoPTZ() {
  return (
    <Suspense>
      <AmpleurWrapper>
        <EligibilityEcoPTZ
          {...{
            dottedName: 'PTZ',
          }}
        />
        <FooterModule />
      </AmpleurWrapper>
    </Suspense>
  )
}
