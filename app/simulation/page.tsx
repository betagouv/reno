import rules from '@/app/règles/rules'
import Form from './Form'
import { StartDsfrOnHydration } from '@codegouvfr/react-dsfr/next-app-router'

export const metadata: Metadata = {
  title: 'Mes Aides Réno : Simulez vos aides à la rénovation énergétique',
  description: `Calculez les aides MaPrimeRénov' 2025 pour la rénovation de votre logement. MaPrimeRénov', les aides des fournisseurs d’énergie (CEE), primes "Coup de Pouce", éco-ptz, exonération de taxe foncière et dispositif Denormandie`,
  alternates: {
    canonical: '/simulation',
  },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <main role="main" id="content">
        <Form rules={rules} />
      </main>
    </>
  )
}
