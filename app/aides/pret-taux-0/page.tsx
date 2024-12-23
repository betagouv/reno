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
          ]}
        />
        <h2>
          Aides pour financer vos travaux de rénovation: Les prêts à taux 0 en{' '}
          {new Date().getFullYear()}
        </h2>
        <p>
          Il existe 2 dispositifs de prêt à taux 0 permettant de financer la
          rénovation d'un logement. Il est <strong>possible de cumuler</strong>{' '}
          ces deux prêts à condition de{' '}
          <strong>financer des postes de travaux différents</strong>.
        </p>
        <CardMosaic>
          <Card>
            <Link href="/aides/pret-taux-0/eco-ptz">
              <Image src={ptzImage} alt="Logo Eco-PTZ" />
              <div>
                <h3>Éco-prêt à taux zéro (éco-PTZ)</h3>
                <p>L'Éco-prêt à taux zéro (éco-PTZ) est ...</p>
              </div>
            </Link>
          </Card>
          <Card>
            <Link href="/aides/pret-taux-0/pret-avance-renovation">
              <Image src={parImage} alt="Logo PAR" />
              <div>
                <h3>Prêt avance mutation - PAR+</h3>
                <p>Le Prêt avance mutation (ou rénovation) est ...</p>
              </div>
            </Link>
          </Card>
        </CardMosaic>
      </Section>
    </Main>
  )
}
