import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@/components/Breadcrumb'
import PAR from './PAR'
import { Suspense } from 'react'

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
    <Main>
      <Section>
        <Breadcrumb
          links={[
            { 'Les aides': '/aides' },
            { 'Les prêts à taux zéro': '/aides/pret-taux-0' },
            {
              'Le prêt avance rénovation':
                '/aides/pret-taux-0/pret-avance-renovation',
            },
          ]}
        />
        <Suspense>
          <PAR />
        </Suspense>
      </Section>
    </Main>
  )
}
