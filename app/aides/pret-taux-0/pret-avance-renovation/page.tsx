import { Card, Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import ptzImage from '@/public/eco-ptz.png'
import parImage from '@/public/par.png'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { CardMosaic } from '@/components/DevenirPartenaire'

export const metadata: Metadata = {
  title:
    'Les prêts à taux 0 destinées à la rénovation énergétique en ' +
    new Date().getFullYear(),
  description:
    'Les prêts à taux 0 destinées à la rénovation énergétique en ' +
    new Date().getFullYear() +
    ": L'éco-prêt à taux 0 (éco-PTZ) et le Prêt avance mutation (PAR+)",
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
              'Le Prêt Avance Rénovation':
                '/aides/pret-taux-0/pret-avance-renovation',
            },
          ]}
        />
        <h2>PAR</h2>
      </Section>
    </Main>
  )
}
