'use client'
import { Suspense } from 'react'
import DPETravauxModule from '@/components/dpe/travaux/DPETravauxModule'
import { useSearchParams } from 'next/navigation'

export default function TravauxIntegration() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DPETravauxModule {...{ numDpe: searchParams.dpe, type: 'module' }} />
    </Suspense>
  )
}
