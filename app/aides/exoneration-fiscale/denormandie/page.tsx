import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@/components/Breadcrumb'
import { Suspense } from 'react'
import PTZ from './PTZ'
import Denormandie from './Denormandie'

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
              'Le dispositif Denormandie':
                '/aides/exoneration-fiscale/denormandie',
            },
          ]}
        />
        <h2>Le dispositif Denormandie</h2>
        <Suspense>
          <Denormandie />
        </Suspense>
      </Section>
    </Main>
  )
}
