import Footer from '@/components/Footer'
import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Accessibilité - Mes aides réno',
  description:
    "Le site Mes aides réno respecte les critères de base de l'accessibilité du Web mais n'est pas encore testé face au référentiel d'accessibilité public RGAA",
}
export default function APIDoc() {
  return (
    <Main>
      <Section>
        <h2>Accessibilité</h2>

        <p>
          L'interface <strong>Mes Aides Réno</strong> respecte au mieux les
          principes d'accessibilité de base du Web : balises HTML sémantiques,
          textes et icônes contrastés, hierarchie des titres des pages,
          accessibilité des formulaires, conception pour mobile d'abord, textes
          alternatifs pour les images, etc.
        </p>
        <p>
          Ils sont exposés par exemple via le guide{' '}
          <a href="https://design-accessible.fr/checklist">Design accessible</a>{' '}
          utilisant les balises HTML sémantiques les plus adaptées.{' '}
        </p>
        <p>
          Le code du site{' '}
          <a href="https://github.com/betagouv/reno">
            est intégralement ouvert
          </a>
          , et basé sur des bibliothèques elles-même ouvertes.
        </p>
        <p>
          Cependant, le site est récent, en phase de développement, il n'a donc
          pas encore été audité pour tester son respect des exigences du{' '}
          <a href="https://accessibilite.numerique.gouv.fr/">
            référentiel public d'accessibilité RGAA
          </a>
          , d'où la mention "non conforme" dans le pied de page.
        </p>
        <p>
          Nous n'avons pas non plus testé le site avec des utilisateurs dans une
          optique d'accessibilité.
        </p>
      </Section>
    </Main>
  )
}
