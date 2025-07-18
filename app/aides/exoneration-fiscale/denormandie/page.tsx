import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import Denormandie from './Denormandie'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: 'Le dispositif Denormandie en ' + new Date().getFullYear(),
  description:
    "Le dispositif Denormandie: Une réduction d'impôts à destination des propriétaires bailleurs",
  alternates: {
    canonical: '/aides/exoneration-fiscale/denormandie',
  },
}

export default function Aides() {
  return (
    <>
      <StartDsfrOnHydration />
      <Main>
        <Section>
          <Breadcrumb
            currentPageLabel="Le dispositif Denormandie"
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
                label: 'Les exonérations fiscales',
                linkProps: {
                  href: '/aides/exoneration-fiscale',
                },
              },
            ]}
          />
          <Suspense>
            <Denormandie />
          </Suspense>
        </Section>
      </Main>
    </>
  )
}
