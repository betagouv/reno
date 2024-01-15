import Footer from '@/components/Footer'
import { PageBlock } from '@/components/UI'
import Link from 'next/link'

export const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
}

export default function Page({ searchParams }) {
  return (
    <PageBlock>
      <main>
        <h1>Mes aides réno</h1>
        <p>Calculez vos aides Ma Prime Rénov' en 10 minutes chrono.</p>
        <Link href="/simulation">C'est parti</Link>
      </main>
      <Footer />
    </PageBlock>
  )
}
