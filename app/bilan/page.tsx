import PersonaBar from '@/components/PersonaBar'
import { PageBlock } from '@/components/UI'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { Metadata } from 'next'

const description = `Vos aides pour la rénovation energétique`

export const metadata: Metadata = {
  title: 'Bilan de vos aides réno',
  description,
  alternates: {
    canonical: '/bilan',
  },
}

export default async function Page(props) {
  const searchParams = await props.searchParams
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <PersonaBar startShown={true} selectedPersona={searchParams.persona} />
      </PageBlock>
    </>
  )
}
