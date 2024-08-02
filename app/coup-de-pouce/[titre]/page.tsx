import PageCoupDePouce from '@/components/cee/PageCoupDePouce'
import { Metadata } from 'next'
import rules from '@/app/règles/rules'

export async function generateMetadata(
  { params }
): Promise<Metadata> {

  const titre = decodeURIComponent(params.titre)
  return {
    title: "Coup de Pouce Chauffage - Remplacement d'une chaudière par "+titre,
    description: "Calculateur de l'aide Coup de Pouce pour le remplacement d'une chaudière par "+titre,
  }
}

export default function CoupDePouceCode({ params }: { params: { titre: string } }) {

  return (
    <PageCoupDePouce {...{params}} />
  )
}
