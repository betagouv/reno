import Copropriete from '@/components/copropriete/Copropriete'
import { Main, PageBlock } from '@/components/UI'
import { Metadata } from 'next'

const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre copropriété.`

export const metadata: Metadata = {
  title: 'Aides réno Copropriété 2024',
  description,
  alternates: {
    canonical: '/copropriete',
  },
}

export default function Page() {
  return (
    <PageBlock>
      <Main>
        <Copropriete />
      </Main>
    </PageBlock>
  )
}
