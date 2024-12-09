import { Main, Section } from '@/components/UI'
import FAQ from './FAQ'
import { Metadata } from 'next/types'
import Contact from '../contact/Contact'

export const metadata: Metadata = {
  title: 'Questions fréquentes - Mes aides réno',
}

export default function FaqPage({ searchParams }) {
  return (
    <Main>
      <Section>
        <FAQ />
        <h2>Nous contacter par mail</h2>
        <p>
          Pour des demandes privées ou nécessitant une réponse, vous pouvez
          écrire directement à l'équipe à{' '}
          <a href="mailto:contact@mesaidesreno.fr">notre adresse mel</a>.<br />
        </p>
        <Contact fromLocation={searchParams.fromLocation} />
      </Section>
    </Main>
  )
}
