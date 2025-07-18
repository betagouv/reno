import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import PAR from './PAR'
import { Suspense } from 'react'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: 'PAR+: Le prêt avance rénovation',
  description:
    'Le prêt avance rénovation: Un prêt hypothécaire dédié à financer vos travaux de rénovation énergétique',
  alternates: {
    canonical: '/aides/pret-taux-0/pret-avance-renovation',
  },
}

export default function PagePAR() {
  return (
    <>
      <StartDsfrOnHydration />
      <Main>
        <Section>
          <Breadcrumb
            currentPageLabel="Le prêt avance rénovation"
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
            <PAR />
          </Suspense>
        </Section>
      </Main>
    </>
  )
}
