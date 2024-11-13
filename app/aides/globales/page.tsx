import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import AidesGlobales from './AidesGlobales'

export const metadata: Metadata = {
  title: 'Estimer mes aides en ' + new Date().getFullYear(),
  description:
    'Estimer mes aides en ' +
    new Date().getFullYear() +
    ": MaPrimeRénov', MaPrimeAdapt'.",
}

export default function PageAidesGlobales() {
  return (
    <Main>
      <Section>
        <AidesGlobales />
      </Section>
    </Main>
  )
}
