import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Footer from '@/components/Footer'
import { CTA, Intro, PageBlock } from '@/components/UI'
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
          <Intro>
            <p>
              En 2024, les aides évoluent pour mieux accompagner les rénovations
              énergétiques.
            </p>

            <p>
              Estimez vos droits en ⌚️ 5 minutes en fonction de votre situation
              et de votre projet.
            </p>
          </Intro>
          <CTA href="/simulation">Commencer la simulation</CTA>
        </Content>
        <div
          style={css`
            background: #26a75f63;
            color: black;
            padding: 1rem;
            width: 100%;
            margin: 4vh 0 0;
          `}
        >
          Mes aides Réno est une initiative du gouvernement et de l'Agence
          nationale de l'habitat pour simplifier l’accès à l’information sur les
          aides à la rénovation énergétique.{' '}
        </div>
        <Wrapper $noMargin={true}>
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
            <VisualExplanation />
          </Content>
        </Wrapper>
        <Footer />
      </PageBlock>
    </main>
  )
}
