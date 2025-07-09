import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Contact from './Contact'

export const metadata: Metadata = {
  title: 'Contact - Mes aides réno',
}

export default function PageContact() {
  return (
    <Main>
      <Section>
        <h1>Nous contacter</h1>
        <p>
          Pour des demandes privées ou nécessitant une réponse, vous pouvez
          écrire directement à l'équipe à{' '}
          <a href="mailto:contact@mesaidesreno.fr">notre adresse mel</a>.<br />
        </p>
        <Contact />
      </Section>
    </Main>
  )
}
