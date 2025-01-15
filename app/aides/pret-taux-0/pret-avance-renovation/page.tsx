import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@/components/Breadcrumb'
import PAR from './PAR'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'PAR+: Le prêt avance mutation (ou rénovation)',
  description:
    'Le prêt avance mutation (ou rénovation): Un prêt hypothécaire dédié à financer vos travaux de rénovation énergétique',
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
            { 'Les prêts à taux 0': '/aides/pret-taux-0' },
            {
              'Le Prêt Avance Rénovation':
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
