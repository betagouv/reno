'use client'
import { Suspense } from 'react'
import DPEFactureModule from '@/components/dpe/DPEFactureModule'
import { useSearchParams } from 'next/navigation'
import useSetSearchParams from '@/components/useSetSearchParams'

export default function FactureIntegration() {
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DPEFactureModule {...{ numDpe: searchParams.dpe, setSearchParams }} />
    </Suspense>
  )
}
