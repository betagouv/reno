import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@/components/Breadcrumb'
import { Suspense } from 'react'
import Denormandie from './Denormandie'

export const metadata: Metadata = {
  title: 'Le dispositif Denormandie en ' + new Date().getFullYear(),
  description:
    "Le dispositif Denormandie: Une réduction d'impôts à destination des propriétaires bailleurs",
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