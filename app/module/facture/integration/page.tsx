'use client'
import { Suspense, useState, useEffect } from 'react'
import DPEFactureModule from '@/components/dpe/DPEFactureModule'
import { useSearchParams } from 'next/navigation'
import useSetSearchParams from '@/components/useSetSearchParams'

export default function Integration() {
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const [dpe, setDpe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDPE = async () => {
      if (searchParams.dpe) {
        try {
          const url = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?q=numero_dpe%3D${searchParams.dpe}`
          const request = await fetch(url)
          const json = await request.json()
          setDpe(json.results[0])
        } catch (e) {
          setError(e)
          console.error(e)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchDPE()
  }, [searchParams.dpe])

  if (loading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur sur le numéro de DPE: {error.message}</div>
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DPEFactureModule {...{ dpe, setSearchParams }} />
    </Suspense>
  )
}
