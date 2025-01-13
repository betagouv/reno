'use client'
import { Suspense } from 'react'
import { FooterModule } from '../FooterModule'
import EligibilityPAR from '@/components/module/EligibilityPAR'

export default function ModulePAR() {
  return (
    <Suspense>
      <EligibilityPAR
        {...{
          dottedName: 'PAR',
        }}
      />
      <FooterModule />
    </Suspense>
  )
}
