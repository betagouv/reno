import { Main, PageBlock } from '@/components/UI'
import Statistiques from './Statistiques'
import { Metadata } from 'next'

const description = `Statistiques du site Mes Aides Réno.`

export const metadata: Metadata = {
  title: 'Statistiques Mes Aides Réno',
  description,
  alternates: {
    canonical: '/statistiques',
  },
}

export default function Page() {
  return (
    <PageBlock>
      <Main>
        <Statistiques />
      </Main>
    </PageBlock>
  )
}
