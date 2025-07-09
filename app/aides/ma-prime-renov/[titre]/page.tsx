import PageMPRG from '@/components/mprg/PageMPRG'
import { Metadata } from 'next'

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params
  const titre = decodeURIComponent(params.titre)

  return {
    title: 'MaPrimeRénov - ' + titre,
    description: "Calculateur de la prime MaPrimeRénov' pour " + titre,
  }
}

export default async function MPRG(props) {
  const params = await props.params

  return <PageMPRG {...{ params }} />
}
