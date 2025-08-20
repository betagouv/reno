import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export const metadata: Metadata = {
  title: 'Mentions légales - Mes aides réno',
}

export default function MentionsLegales() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Mentions légales"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <h1>Mentions légales</h1>
        <h2>Éditeur de la plateforme</h2>
        <p>
          Mes Aides Réno est à l’initiative de la Direction Interministérielle
          du Numérique (DINUM) située :
        </p>
        <p>
          20 Av. de Ségur
          <br /> 75007 Paris
          <br /> France
          <br /> Téléphone : 01 71 21 11 33
        </p>
        <h2>Directrice de la publication</h2>
        <p>
          Madame Stéphanie SCHAER, en sa qualité de directrice générale de la
          DINUM
        </p>
        <h2>Hébergement de la plateforme</h2>
        <p>
          Scalingo SAS
          <br />
          13 rue Jacques Peirotes
          <br />
          67000 Strasbourg
          <br /> France
          <br />
          <a className="fr-link" href="mailto:support@scalingo.com">
            support@scalingo.com
          </a>
        </p>
        <h2>Accessibilité</h2>
        <p>
          La conformité aux normes d’accessibilité numérique est un objectif
          ultérieur mais nous tâchons de rendre cette plateforme accessible à
          toutes et à tous. Pour en savoir plus sur la politique d’accessibilité
          numérique de l’État :<br />
          <a
            className="fr-link"
            rel="noopener external"
            target="_blank"
            href="https://accessibilite.numerique.gouv.fr/"
          >
            https://accessibilite.numerique.gouv.fr/
          </a>
        </p>
        <p>
          Pour nous signaler un défaut d’accessibilité vous empêchant d’accéder
          à un contenu ou une fonctionnalité de la plateforme, merci de nous en
          faire part à l’adresse suivante :<br />
          <a className="fr-link" href="mailto:contact@mesaidesreno.fr">
            contact@mesaidesreno.fr
          </a>
        </p>
        <p>
          Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en
          droit de faire parvenir vos doléances ou une demande de saisine au
          Défenseur des droits.
        </p>
        <h2>Sécurité</h2>
        <p>
          La plateforme est protégée par un certificat électronique, matérialisé
          pour la grande majorité des navigateurs par un cadenas. Cette
          protection participe à la confidentialité des échanges.
        </p>
        <p>
          En aucun cas, les services associés à la plateforme ne seront à
          l’origine d’envoi de courriels pour vous demander la saisie
          d’informations personnelles.
        </p>
      </PageBlock>
    </>
  )
}
