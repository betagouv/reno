import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@/components/Breadcrumb'
import { Suspense } from 'react'
import PTZ from './PTZ'
import TaxeFonciere from './TaxeFonciere'

export const metadata: Metadata = {
  title: "Eco-PTZ: L'éco-prêt à taux 0 en" + new Date().getFullYear(),
  description:
    "L'éco-PTZ: Un prêt à taux 0 sans conditions de ressource destinées à financer la rénovation énergétique de votre logement en " +
    new Date().getFullYear(),
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
        <h2>L'exonération de taxe foncière</h2>
        <Suspense>
          <TaxeFonciere />
        </Suspense>
      </Section>
    </Main>
  )
}
