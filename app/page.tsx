import Footer from '@/components/Footer'
import { CTA, PageBlock } from '@/components/UI'
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
        <h1>Calculez vos aides rénovation 2024</h1>
        <p>
          Calculez votre éligibilité et le montant de vos aides Ma Prime Rénov'
          en 2 minutes chrono.
        </p>
        <CTA href="/simulation">C'est parti</CTA>
      </main>
      <Footer />
    </PageBlock>
  )
}
