import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Contact from './Contact'

export const metadata: Metadata = {
  title: 'Contact - Mes aides réno',
}

export default function PageContact({ searchParams }) {
  return (
    <Main>
      <Section>
      <h2>Nous contacter par mail</h2>
        <p>
          Pour des demandes privées, vous pouvez écrire directement à l'équipe à{' '}
          <a href="mailto:contact@mesaidesreno.fr">notre adresse mel</a>.<br />
        </p>
        <Contact fromLocation={searchParams.fromLocation} />
      </Section>
    </Main>
  )
}
