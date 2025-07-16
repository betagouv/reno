import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import TaxeFonciere from './TaxeFonciere'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export const metadata: Metadata = {
  title: "L'exonération de taxe foncière en " + new Date().getFullYear(),
  description:
    "L'exonération de taxe foncière: un dispositif visant à favoriser la rénovation énergétique de votre logement",
  alternates: {
    canonical: '/aides/exoneration-fiscale/taxe-fonciere',
  },
}

export default function Aides() {
  return (
    <Main>
      <Section>
        <Breadcrumb
          currentPageLabel="L'exonération de taxe foncière"
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
          <TaxeFonciere />
        </Suspense>
      </Section>
    </Main>
  )
}
