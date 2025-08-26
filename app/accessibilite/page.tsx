import { PageBlock } from '@/components/UI'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export const metadata: Metadata = {
  title: 'Accessibilité - Mes aides réno',
  description:
    "Le site Mes Aides Réno respecte les critères de base de l'accessibilité du Web mais n'est pas encore testé face au référentiel d'accessibilité public RGAA",
}
export default function APIDoc() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Accessibilité"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <h1>Accessibilité</h1>
        <p>
          L'interface <strong>Mes Aides Réno</strong> respecte au mieux les
          principes d'accessibilité de base du Web : balises HTML sémantiques,
          textes et icônes contrastés, hierarchie des titres des pages,
          accessibilité des formulaires, conception pour mobile d'abord, textes
          alternatifs pour les images, etc.
        </p>
        <p>
          Ils sont exposés par exemple via le guide{' '}
          <a
            rel="noopener exteral"
            className="fr-link"
            href="https://design-accessible.fr/checklist"
          >
            Design accessible
          </a>
          .
        </p>
        <p>
          Cependant, le site est récent, en phase de développement, il n'a donc
          pas encore été audité pour tester son respect des exigences du{' '}
          <a
            rel="noopener exteral"
            className="fr-link"
            href="https://accessibilite.numerique.gouv.fr/"
          >
            référentiel public d'accessibilité RGAA
          </a>
          , d'où la mention "partiellement conforme" dans le pied de page.
        </p>
        <p>
          Nous n'avons pas non plus testé le site avec des utilisateurs dans une
          optique d'accessibilité.
        </p>
        <p>
          Le code du site{' '}
          <a
            rel="noopener exteral"
            className="fr-link"
            href="https://github.com/betagouv/reno"
          >
            est intégralement ouvert
          </a>
          , n'hésitez pas à nous faire des retours.
        </p>
      </PageBlock>
    </>
  )
}
