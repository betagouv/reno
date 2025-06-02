import rules from '@/app/règles/rules'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Mes aides réno : Simulez vos aides à la rénovation énergétique',
  description: `Calculez les aides MaPrimeRénov' 2025 pour la rénovation de votre logement. MaPrimeRénov', les aides des fournisseurs d’énergie (CEE), Coup de pouce énergie, éco-ptz, exonération de taxe foncière et dispositif Denormandie`,
  alternates: {
    canonical: '/simulation',
  },
}

export default function Page() {
  return <Form rules={rules} />
}
