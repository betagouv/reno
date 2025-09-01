import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import AidesGlobales from './AidesGlobales'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const metadata: Metadata = {
  title: 'Estimer mes aides en ' + new Date().getFullYear(),
  description:
    'Estimer mes aides en ' +
    new Date().getFullYear() +
    ": MaPrimeRénov', MaPrimeAdapt'.",
}

export default function PageAidesGlobales() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <AidesGlobales />
      </PageBlock>
    </>
  )
}
