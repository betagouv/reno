import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Breadcrumb from '@/components/Breadcrumb'
import { Suspense } from 'react'
import PTZ from './PTZ'

export const metadata: Metadata = {
  title: "Eco-PTZ: L'éco-prêt à taux 0 en " + new Date().getFullYear(),
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
            { 'Les prêts à taux 0': '/aides/pret-taux-0' },
            {
              "L'éco-PTZ": '/aides/pret-taux-0/eco-ptz',
            },
          ]}
        />
        <Suspense>
          <PTZ />
        </Suspense>
      </Section>
    </Main>
  )
}
