import index from '@/app/règles/index.yaml'
import revenus from '@/app/règles/revenus.yaml'
import mpa from '@/app/règles/ma-prime-adapt.publicodes'
import { Metadata } from 'next'
import Form from '../Form'

const description = `Calculez les aides Ma Prime Adapt pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides rénovation MaPrimeAdapt 2024',
  description,
  alternates: {
    canonical: '/ma-prime-aapt',
  },
}

export default function Page() {
  return (
    <Form
      rules={{
        ...index,
        ...revenus,
        ...mpa,
      }}
    />
  )
}
