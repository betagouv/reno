import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import PTZ from './PTZ'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: "Eco-PTZ : L'éco-prêt à taux zéro en " + new Date().getFullYear(),
  description:
    "L'éco-PTZ : Un prêt à taux zéro sans conditions de ressource destinées à financer la rénovation énergétique de votre logement en " +
    new Date().getFullYear(),
  alternates: {
    canonical: '/aides/pret-taux-0/eco-ptz',
  },
}

export default function Aides() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="L'éco-PTZ"
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Les aides',
              linkProps: {
                href: '/aides',
              },
            },
            {
              label: 'Les prêts à taux 0',
              linkProps: {
                href: '/aides/pret-taux-0',
              },
            },
          ]}
        />
        <Suspense>
          <PTZ />
        </Suspense>
      </PageBlock>
    </>
  )
}
