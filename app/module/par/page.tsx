'use client'
import { Suspense } from 'react'
import { FooterModule } from '../Ampleur'
import { AmpleurWrapper } from '../AmpleurUI'
import EligibilityPAR from '@/components/module/EligibilityPAR'

export default function ModulePAR() {
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
