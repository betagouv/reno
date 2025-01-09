import rules from '@/app/règles/rules'
import Form from './Form'

const description = `Calculez les aides Ma Prime Rénov' 2025 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Mes Aides réno : simulation 2025',
  description,
  alternates: {
    canonical: '/simulation',
  },
}

export default function Page() {
  return <Form rules={rules} />
}
