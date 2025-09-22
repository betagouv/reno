import { Metadata } from 'next/types'
import { Suspense } from 'react'
import Personas from '../Personas'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { PageBlock } from '@/components/UI'

export const metadata: Metadata = {
  title: 'Personas - Mes aides réno',
  description:
    "Choisissez l'un des personas pour explorer les résultats de simulation d'une variété de profils types",
}

export default function PersonasPage() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Personas"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <Suspense>
          <Personas />
        </Suspense>
      </PageBlock>
    </>
  )
}
