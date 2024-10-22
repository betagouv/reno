import rules from '@/app/règles/rules'
import { Main, PageBlock } from '@/components/UI'
import Form from './Form'
import Eligibility from '@/components/Eligibility'
import PersonaBar from '@/components/PersonaBar'

const description = `Vos aides pour la rénovation energétique`

export const metadata: Metadata = {
  title: 'Bilan de vos aides réno',
  description,
  alternates: {
    canonical: '/bilan',
  },
}

export default function Page({ searchParams }) {
  return (
    <PageBlock>
      <Main>
        <PersonaBar startShown={true} selectedPersona={searchParams.persona} />
      </Main>
    </PageBlock>
  )
}
