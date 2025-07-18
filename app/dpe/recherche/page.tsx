import { PageBlock, Section } from '@/components/UI'
import DPEAnalyzer from '@/components/dpe/DPEAnalyzer'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const description = `Chercher dans l'annuaire des Diagnostics de performance énergétique (DPE).`

export const metadata: Metadata = {
  title: "Trouver et analyser le DPE d'un logement",
  description,
  openGraph: { images: ['/jaquette.png'] },
}

export default async function Page(props) {
  const searchParams = await props.searchParams
  return (
    <>
      <StartDsfrOnHydration />
      <main>
        <Section>
          <PageBlock>
            <h1>Trouver et analyser un DPE</h1>
            <DPEAnalyzer searchParams={searchParams} />
          </PageBlock>
        </Section>
      </main>
    </>
  )
}
