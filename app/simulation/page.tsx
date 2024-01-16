import Footer from '@/components/Footer'
import { PageBlock } from '@/components/UI'
import Form from './Form'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'

const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
}

export default function Page({ searchParams }) {
  return (
    <PageBlock>
      <main
        style={css`
          width: 98vw;
          padding: 0 1vw;
          margin: 0 auto;
        `}
      >
        <Form searchParams={searchParams} rules={rules} />
      </main>
      <Footer />
    </PageBlock>
  )
}
