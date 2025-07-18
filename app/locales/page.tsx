import { Main } from '@/components/UI'
import { Metadata } from 'next/types'
import Liste from './Liste'
import { description } from './description'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title:
    'Liste des aides locales pour la rénovation energétique - Mes aides réno',
  description,
}

export default function AidesLocales() {
  return (
    <>
      <StartDsfrOnHydration />
      <Main>
        <Liste />
      </Main>
    </>
  )
}
