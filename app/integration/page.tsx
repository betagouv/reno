import css from '@/components/css/convertToJs'
import Integration from '@/components/Integration'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'

export const description = `Vous pouvez intégrer le simulateur Mes Aides Réno sur votre site Web en trois clics.`

export const metadata: Metadata = {
  title: 'Intégrer le simulateur Mes Aides Réno',
  description,
  openGraph: { images: ['/iframe.png'] },
}

export default function Page() {
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <Integration />
    </main>
  )
}
