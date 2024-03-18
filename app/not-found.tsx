import { Main, Section } from '@/components/UI'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Main>
      <Section>
        <h2>Page non trouvée</h2>
        <p>Le lien que vous avez suivi semble obsolète.</p>
        <p>
          Nous vous invitons à{' '}
          <Link href="/">revenir sur la page d'accueil</Link>.
        </p>
      </Section>
    </Main>
  )
}
