import { Main, Section } from '@/components/UI'
import FAQ from './FAQ'

export default function FaqPage() {
  return (
    <Main>
      <Section>
        <h1>Questions fréquentes</h1>
        <p>
          Voici quelques réponses aux questions les plus fréquentes au sujet des
          aides à la rénovation thermique.{' '}
        </p>
        <p>
          Si vous ne trouvez pas ce que vous cherchez, contactez-nous via le
          formulaire ci-dessous.
        </p>
        <FAQ />
        {/*
        <Contact />

*/}
      </Section>
    </Main>
  )
}
