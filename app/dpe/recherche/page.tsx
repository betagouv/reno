import DpeAddressSearch from '@/components/dpe/DPEAddressSearch'
import { PageBlock, Section } from '@/components/UI'
import css from '@/components/css/convertToJs'
import DPEAnalyzer from '@/components/dpe/DPEAnalyzer'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'

export const description = `Chercher dans l'annuaire des Diagnostics de performance énergétique (DPE).`

export const metadata: Metadata = {
  title: "Trouver et analyser le DPE d'un logement",
  description,
  openGraph: { images: ['/jaquette.png'] },
}

export default async function Page(props) {
  return (
    <main
      style={css`
        background: white;
        padding: calc(1.5vh + 1.5vw) 0.6rem;
      `}
    >
      <Section>
        <PageBlock>
          <h1>Trouver et analyser un DPE</h1>
          <DPEAnalyzer {...{ props }} />
        </PageBlock>
      </Section>
    </main>
  )
}
