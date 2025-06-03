import PageCoupDePouce from '@/components/cee/PageCoupDePouce'
import { Metadata } from 'next'

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params
  const titre = decodeURIComponent(params.titre)
  return {
    title: `"Coup de Pouce" Chauffage - Remplacement d'une chaudière par ${titre}`,
    description: `Calculateur de l'aide "Coup de Pouce" pour le remplacement d'une chaudière par ${titre}`,
  }
}

export default async function CoupDePouceCode(props) {
  const params = await props.params
  return <PageCoupDePouce {...{ params }} />
}
