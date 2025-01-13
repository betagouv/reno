import rules from '@/app/règles/rules'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Mes Aides réno : Simulez vos aides à la rénovation énergétique',
  description: `Calculez les aides Ma Prime Rénov' 2025 pour la rénovation de votre logement. MaPrimeRénov, CEE, Coup de pouce énergie, eco-ptz, exonération de taxe foncière et dispositif denormandie`,
  alternates: {
    canonical: '/simulation',
  },
}

export default function Page() {
  return <Form rules={rules} />
}
