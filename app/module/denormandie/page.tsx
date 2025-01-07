'use client'
import { Suspense } from 'react'
import { FooterModule } from '../Ampleur'
import { AmpleurWrapper } from '../AmpleurUI'
import EligibilityDenormandie from '@/components/module/EligibilityDenormandie'

export default function ModuleDenormandie() {
  return (
    <Suspense>
      <AmpleurWrapper>
        <EligibilityDenormandie
          {...{
            dottedName: 'denormandie',
          }}
        />
        <FooterModule />
      </AmpleurWrapper>
    </Suspense>
  )
}
