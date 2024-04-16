import Footer from '@/components/Footer'
import { Main, PageBlock } from '@/components/UI'
import Form from './Form'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'

const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
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
