import { PageBlock } from '@/components/UI'
import Statistiques from './Statistiques'
import { Metadata } from 'next'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

const description = `Statistiques du site Mes Aides Réno.`

export const metadata: Metadata = {
  title: 'Statistiques Mes Aides Réno',
  description,
  alternates: {
    canonical: '/stats',
  },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Statistiques />
      </PageBlock>
    </>
  )
}
