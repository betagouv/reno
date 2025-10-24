import rules from '@/app/règles/rules'
import { Metadata } from 'next'
import Form from '../Form'
import simulationConfigAll from '../simulationConfigAll.yaml'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { PageBlock } from '@/components/UI'

const description = `Calculez les aides Ma Prime Adapt pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Calculez les aides à la rénovation en ' + new Date().getFullYear(),
  description,
  alternates: {
    canonical: '/v2',
  },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Form simulationConfig={simulationConfigAll} rules={rules} />
      </PageBlock>
    </>
  )
}
