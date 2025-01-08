'use client'
import { Suspense } from 'react'
import { FooterModule } from '../Ampleur'
import { AmpleurWrapper } from '../AmpleurUI'
import EligibilityTaxeFonciere from '@/components/module/EligibilityTaxeFonciere'

export default function ModuleTaxeFonciere() {
  return (
    <Suspense>
      <AmpleurWrapper>
        <EligibilityTaxeFonciere
          {...{
            dottedName: 'taxe foncière',
          }}
        />
        <FooterModule />
      </AmpleurWrapper>
    </Suspense>
  )
}
