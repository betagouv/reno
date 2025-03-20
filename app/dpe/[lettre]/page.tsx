import { Suspense } from 'react'
import DPEPage from '@/components/dpe/DPEPage'
export async function generateMetadata({ params }) {
  return {
    title: `Les informations importantes pour les logements avec un DPE ${params.lettre}`,
    description: `Pour les logements classés ${params.lettre} : quelles sont les aides à la rénovation? y a-t-il une interdiction de location? quel est l'impact sur le prix à la revente?`,
    openGraph: { images: ['/jaquette.png'] },
  }
}

export default async function Page(props: Props) {
  const lettre = (await props.params).lettre

  return (
    <Suspense>
      <DPEPage lettre={lettre} />
    </Suspense>
  )
}
