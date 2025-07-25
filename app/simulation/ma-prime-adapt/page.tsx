import rules from '@/app/règles/rules'
import { Metadata } from 'next'
import Form from '../Form'
import simulationConfigMPA from '../simulationConfigMPA.yaml'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { PageBlock } from '@/components/UI'

const description = `Calculez les aides Ma Prime Adapt pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides rénovation MaPrimeAdapt 2024',
  description,
  alternates: {
    canonical: '/ma-prime-adapt',
  },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Form simulationConfig={simulationConfigMPA} rules={rules} />
      </PageBlock>
    </>
  )
}
