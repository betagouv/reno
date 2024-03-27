import { Main, Section } from '@/components/UI'
import FAQ from './FAQ'
import { Metadata } from 'next/types'
import Footer from '@/components/Footer'
import Contact from './Contact'

export const metadata: Metadata = {
  title: 'Questions fréquentes - Mes aides réno',
}

export default function FaqPage({ searchParams }) {
  return (
    <Main>
      <Section>
        <h1>Questions et contact</h1>
        <p>
          Voici quelques réponses aux questions les plus fréquentes au sujet des
          aides à la rénovation thermique.{' '}
        </p>
        <p>
          Si vous ne trouvez pas ce que vous cherchez, contactez-nous via le
          formulaire ci-dessous.
        </p>
        <FAQ />
        <Contact fromLocation={searchParams.fromLocation} />
      </Section>
    </Main>
  )
}
