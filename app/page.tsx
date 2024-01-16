import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Footer from '@/components/Footer'
import { CTA, PageBlock } from '@/components/UI'
import VisualExplanation from './VisualExplanation'

export const description = `Calculez les aides Ma Prime Rénov' 2024 pour la rénovation de votre logement.`

export const metadata: Metadata = {
  title: 'Aides réno 2024',
  description,
}

export default function Page({ searchParams }) {
  return (
    <main>
      <PageBlock>
        <Content>
          <h1>Calculez vos aides rénovation 2024</h1>
          <p
            style={css`
              margin: 2rem 0 1.6rem;
              width: 600px;
              max-width: 90%;
            `}
          >
            En 2024, les aides à la rénovation thermique des logements
            particuliers ont été renforcées. Calculez votre éligibilité et le
            montant de vos aides Ma Prime Rénov' en ⌚️ 5 minutes chrono.
          </p>
          <CTA href="/simulation">C'est parti</CTA>
        </Content>
        <Wrapper>
          <Content>
            <p>
              Les aides Ma Prime Rénov' sont destinées aux propriétaires dont le
              logement est occupé ou loué comme résidence principale.{' '}
            </p>
            <p>
              En 2024, tous les foyers peuvent bénéficier d'une aide minimum,
              quelque soit leur revenu, grâce à un parcours accompagné pour des
              rénovations ambitieuses de deux sauts de DPE.
            </p>
            <p>
              Deux dispositifs Ma Prime Rénov' existent. Ce calculateur vous
              aide à les comprendre et à choisir celui qui vous convient.
            </p>
          </Content>
        </Wrapper>
        <Wrapper>
          <Content>
            <VisualExplanation />
          </Content>
        </Wrapper>
        <Footer />
      </PageBlock>
    </main>
  )
}
