import Footer from '@/components/Footer'
import { PageBlock } from '@/components/UI'
import Form from './Form'
import rules from '@/app/règles/rules'

const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
}

export default function Page({ searchParams }) {
  return (
    <PageBlock>
      <main>
        <Form searchParams={searchParams} rules={rules} />
      </main>
      <Footer />
    </PageBlock>
  )
}
