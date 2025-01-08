import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@/components/Breadcrumb'
import { Suspense } from 'react'
import TaxeFonciere from './TaxeFonciere'

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
          links={[
            { 'Les aides': '/aides' },
            { 'Les exonérations fiscales': '/aides/exoneration-fiscale' },
            {
              "L'exonération de taxe foncière":
                '/aides/exoneration-fiscale/taxe-fonciere',
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
