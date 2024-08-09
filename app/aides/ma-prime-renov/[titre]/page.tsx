import PageMPRG from '@/components/mprg/PageMPRG'
import { Metadata } from 'next'

export async function generateMetadata(
  { params }
): Promise<Metadata> {
  const titre = decodeURIComponent(params.titre);

  return {
    title: "MaPrimeRénov - "+titre,
    description: "Calculateur de la prime MaPrimeRénov' pour "+titre,
  }
}

export default function MPRG({ params }: { params: { titre: string } }) {

  return (
    <PageMPRG {...{params}} />
  )
}
