import Footer from '@/components/Footer'
import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'À propos - Mes aides réno',
}

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
        <p>
          Il est conçu en partenariat avec l'
          <a
            href="https://www.anah.gouv.fr/"
            title="L'Agence Nationale de l'Habitat"
          >
            ANAH
          </a>{' '}
          et <a href="https://france-renov.gouv.fr/">France Rénov'</a>.
        </p>

        <p>
          Le service est incubé à l'incubateur des services numériques de l'État{' '}
          <a href="https://beta.gouv.fr">BetaGouv</a>.
        </p>
        <p>
          Vous pouvez en apprendre davantage sur le problème que nous souhaitons
          résoudre, les solutions que nous expérimentons et comment nous
          comptons en étudier l'impact en lisant notre{' '}
          <a href="https://www.beta.gouv.fr/startups/mesaidesreno.html">
            fiche produit
          </a>
          .
        </p>
        <p>
          Le code du site{' '}
          <a href="https://github.com/betagouv/reno">
            est intégralement ouvert
          </a>
          , et basé sur des bibliothèques elles-même ouvertes.
        </p>
      </Section>
      <Footer />
    </Main>
  )
}
