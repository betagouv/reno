'use client'
import { Suspense } from 'react'
import EligibilityEcoPTZ from '@/components/eco-ptz/EligibilityEcoPTZ'
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
