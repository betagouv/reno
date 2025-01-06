'use client'
import { Suspense } from 'react'
import EligibilityEcoPTZ from '@/components/eco-ptz/EligibilityEcoPTZ'
import { FooterModule } from '../Ampleur'
import { AmpleurWrapper } from '../AmpleurUI'
import EligibilityPAR from '@/components/par/EligibilityPAR'

export default function ModuleEcoPTZ() {
  return (
    <Suspense>
      <AmpleurWrapper>
        <EligibilityPAR
          {...{
            dottedName: 'PAR',
          }}
        />
        <FooterModule />
      </AmpleurWrapper>
    </Suspense>
  )
}
