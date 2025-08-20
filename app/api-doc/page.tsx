import { Metadata } from 'next/types'
import API from './API'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: 'API - Mes aides réno',
  description:
    "Découvrez la documentation de l'API de calcul des aides à la rénovation",
}

export default function APIDoc() {
  return (
    <>
      <StartDsfrOnHydration />
      <API />
    </>
  )
}
