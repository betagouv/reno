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
          Mes Aides Réno est édité et géré par l’Agence nationale de l’habitat (Anah) située :
        </p>
        <p>
          8 avenue de l’Opéra
          <br /> 75001 Paris
          <br /> France
          <br /> Téléphone : 0806 70 38 03
        </p>
        <h2>Directrice de la publication</h2>
        <p>
          Valérie Mancret-Taylor, directrice générale de l’Anah.
        </p>
        <h2>Hébergement de la plateforme</h2>
        <p>
          Orange Business Services - Direction EOLAS
          <br />
          Dénomination sociale : Orange Business Services SA au capital de 1.063.592.809,20 €
          <br />
          Siège social : 29 rue Servan, 38000 Grenoble, France - SIRET 345 039 416 00713
          <br /> Numéro de TVA intracommunautaire : FR26345039416
          <br /> Téléphone : +33 4 76 44 50 50
          <br /> RCS Bobigny 345 039 416
        </p>
        <h2>Accessibilité</h2>
        <p>
          Si, malgré notre vigilance, vous rencontrez le moindre problème d’accessibilité sur notre site,
          vous pouvez transmettre votre message à l’adresse suivante  <a className="fr-link" href="mailto:webmestre@anah.gouv.fr">
          webmestre@anah.gouv.fr
        </a>. Plus d’informations sur le sujet dans la rubrique Accessibilité.
        </p>
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments techniques, graphiques, textuels ou autres constituant le Site sont la propriété exclusive de l’Anah ou, le cas échéant, de ses prestataires fournisseurs. L’internaute du Site reconnaît qu'aucune propriété ne lui est transmise, et qu'aucun droit ou licence ne lui est accordé, en dehors du droit de visiter le Site et d'utiliser les services de ce dernier auquel il a accès.
          <br />
          Toute représentation, reproduction, adaptation, traduction, rediffusion, totale ou partielle du Site, de son contenu, de ses marques, par quelque procédé que ce soit, sans autorisation préalable et expresse de l’Anah, engage la responsabilité civile et/ou pénale de son auteur et sera susceptible d'entraîner des poursuites judiciaires à son encontre.
        </p>
        <h2>Sécurité</h2>
        <p>
          La plateforme est protégée par un certificat électronique, matérialisé pour la grande majorité des navigateurs par un cadenas.
          Cette protection participe à la confidentialité des échanges.
        </p>
        <p>
          En aucun cas, les services associés à la plateforme ne seront à l’origine d’envoi de courriels pour vous demander la saisie d’informations personnelles.
        </p>
      </PageBlock>
    </>
  )
}
