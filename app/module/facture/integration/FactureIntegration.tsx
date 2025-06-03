'use client'
import { Suspense } from 'react'
import DPEFactureModule from '@/components/dpe/DPEFactureModule'
import { useSearchParams } from 'next/navigation'

export default function FactureIntegration() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DPEFactureModule {...{ numDpe: searchParams.dpe, type: 'module' }} />
    </Suspense>
  )
}
