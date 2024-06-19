import { Main } from '@/components/UI'
import { Metadata } from 'next/types'
import Liste from './Liste'
import { description } from './description'

export const metadata: Metadata = {
  title: 'Liste des aides locales - Mes aides réno',
  description,
}

export default function AidesLocales({ searchParams }) {
  return (
    <Main>
      <Liste />
    </Main>
  )
}
