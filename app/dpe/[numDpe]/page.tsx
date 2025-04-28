import { Suspense } from 'react'
import DPEPage from '@/components/dpe/DPEPage'
export async function generateMetadata({ params }) {
  return {
    title: `Les informations importantes pour le DPE ${params.numDpe}`,
    description: `Pour le DPE n° ${params.numDpe} : quelles sont les aides à la rénovation? y a-t-il une interdiction de location? quel est l'impact sur le prix à la revente?`,
    openGraph: { images: ['/jaquette.png'] },
  }
}
export const isValidDpeNumber = (dpeNumber) => {
  const regex = /^[a-zA-Z0-9]{13}$/
  return regex.test(dpeNumber)
}

export default async function Page(props: Props) {
  const params = await props.params

  return (
    isValidDpeNumber(params.numDpe) && (
      <Suspense>
        <DPEPage numDpe={params.numDpe} />
      </Suspense>
    )
  )
}
