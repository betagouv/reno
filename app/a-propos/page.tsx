import css from '@/components/css/convertToJs'
import Footer from '@/components/Footer'
import { Main, Section } from '@/components/UI'
import Link from '@/node_modules/next/link'

export default function APIDoc() {
  return (
    <Main>
      <Section>
        <h2>À propos</h2>

        <p>
          <strong>Mes Aides Réno</strong> est un service de la Direction du
          Numérique lancé en avril 2024 pour simplifier l’accès à l’information
          sur les aides à la rénovation énergétique.
        </p>
        <p>Il est conçu en partenariat avec l'ANAH et France Rénov'.</p>

        <p>
          Le service est incubé à l'incubateur des services numériques de l'État{' '}
          <a href="https://beta.gouv.fr">BetaGouv</a>.
        </p>
        <p>
          Vous pouvez en apprendre davantage sur{' '}
          <a href="https://www.beta.gouv.fr/startups/mesaidesreno.html">
            le problème que nous souhaitons résoudre
          </a>
          , les solutions que nous expérimentons et comment nous comptons en
          étudier l'impact .
        </p>
      </Section>
      <Footer />
    </Main>
  )
}
