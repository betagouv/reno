import DpeAddressSearch from '@/components/DpeAddressSearch'
import { PageBlock, Section } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'

export const description = `Chercher dans l'annuaire des Diagnostics de performance énergétique (DPE).`

export const metadata: Metadata = {
  title: "Trouver le DPE d'un logement",
  description,
  openGraph: { images: ['/jaquette.png'] },
}

export default async function Page(props) {
  const searchParams = await props.searchParams
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <Section>
        <PageBlock>
          <h1>Trouver un DPE</h1>
          <DpeAddressSearch searchParams={searchParams} />
        </PageBlock>
      </Section>
    </main>
  )
}
