import rules from '@/app/règles/rules'
import Form from './Form'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { PageBlock } from '@/components/UI'
import simulationConfig from '/app/simulation/simulationConfig.yaml'

export async function generateMetadata(props) {
  const { objectif } = await props.searchParams
  return {
    title:
      objectif == 'etape'
        ? 'Guide - Comment obtenir vos aides'
        : 'Estimez vos aides à la rénovation énergétique',
    description: `Calculez les aides MaPrimeRénov' 2025 pour la rénovation de votre logement. MaPrimeRénov', les aides des fournisseurs d’énergie (CEE), primes "Coup de Pouce", éco-ptz, exonération de taxe foncière et dispositif Denormandie`,
    alternates: {
      canonical: '/simulation',
    },
  }
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Form simulationConfig={simulationConfig} rules={rules} />
      </PageBlock>
    </>
  )
}
