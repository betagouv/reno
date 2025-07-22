import { Suspense } from 'react'
import DPEPage from '@/components/dpe/DPEPage'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
export async function generateMetadata(props) {
  const params = await props.params
  return {
    title: `Les informations importantes pour le DPE ${params.numDpe}`,
    description: `Pour le DPE n° ${params.numDpe} : quelles sont les aides à la rénovation? y a-t-il une interdiction de location? quel est l'impact sur le prix à la revente?`,
    openGraph: { images: ['/jaquette.png'] },
  }
}
export default async function Page(props: Props) {
  const params = await props.params

  return (
    <>
      <StartDsfrOnHydration />
      <Suspense>
        <DPEPage numDpe={params.numDpe} />
      </Suspense>
    </>
  )
}
