import rules from '@/app/règles/rules'
import { Main, PageBlock } from '@/components/UI'
import Form from './Form'

const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
  alternates: {
    canonical: '/simulation',
  },
}

export default function Page() {
  return (
    <PageBlock>
      <Main>
        <Form rules={rules} />
      </Main>
    </PageBlock>
  )
}
