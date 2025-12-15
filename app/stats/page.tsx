import { PageBlock } from '@/components/UI'
import Statistiques from './Statistiques'
import { Metadata } from 'next'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import StatistiquesInternes from './StatistiquesInternes'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

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
        <Breadcrumb
          currentPageLabel="Statistiques"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <Statistiques />
      </PageBlock>
    </>
  )
}
