import Footer from '@/components/Footer'
import { ExternalLink, Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Confidentialité - Mes aides réno',
  description:
    "Mes Aides réno respecte votre vie privée, découvrez l'usage que nous faisons de vos données.",
}

export default function APIDoc() {
  return (
    <Main>
      <Section>
        <h1>Confidentialité</h1>

        <h2>Traceurs</h2>
        <p>
          Nous utilisons le traceur libre Matomo, via l'instance hébergée par
          les services de l'État sur stats.beta.gouv.fr.
        </p>
        <p>
          Quand vous faites une simulation sur Mes Aides Réno, et que vous
          saisissez par exemple votre catégorie de revenu, cette information est
          reçue par notre serveur (car les données sont stockées dans la barre
          d'adresse de votre navigateur).
        </p>
        <p>
          L'adresse est stockée dans notre outil de suivi d'audience, mais aucun
          compte utilisateur nominatif n'est créé et les données ne sont
          utilisées que pour améliorer les parcours sur le site et la fiabilité
          du modèle de calcul.
        </p>
        <p>
          L'outil de suivi Matomo est configuré pour un suivi qui ne nécessite
          pas de bannière de consentement RGPD (dite "cookies").
        </p>
        <h2>Refuser le suivi de votre usage du site</h2>
        <div id="matomo-opt-out"></div>
        <script src="https://stats.beta.gouv.fr/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=auto&showIntro=1"></script>

        <h2>Partage des données de simulation à des sites Web tiers</h2>
        <p>
          Dans le cadre de l'intégration de Mes Aides Réno comme un module de
          simulation sur d'autres sites Web, les données que vous saisissez dans
          notre simulateur peuvent être ensuite partagées au site tiers
          intégrateur du module, dit l'hôte.
        </p>
        <p>
          Dans le cas général, quand l'hôte du module a décidé d'activer le
          partage de données de simulation, votre consentement au partage des
          données sera demandé avant le partage effectif. Une fois le partage
          fait, l'organisation hôte est le responsable du traitement de ces
          données.
        </p>
        <p>
          Dans le cadre de l'intégration particulière de notre simulateur sur le
          site jagis.beta.gouv.fr, nous autorisons le partage des données de
          simulation au système d'information du service J'agis pour
          l'accomplissement de ses missions de service public, conformément à
          l'[article
          premier](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000033202940)
          de la loi pour une République numérique.
        </p>
        <p>
          Les membres habilités de l’équipe “J’agis” du Secrétariat général à la
          planification écologique (SGPE) et de la Direction interministérielle
          du numérique (DINUM) dans le cadre de l’intégration du simulateur
          d’aides via iFrame sont alors responsables du traitement des données
          partagées.
        </p>
        <h2>Serveur</h2>
        <p>
          Notre serveur est géré par la société française{' '}
          <a
            className="fr-link"
            rel="noopener external"
            href="https://annuaire-entreprises.data.gouv.fr/entreprise/scalingo-808665483"
          >
            Scalingo
          </a>
          , et est physiquement localisé en France. Voici le{' '}
          <a
            className="fr-link"
            rel="noopener external"
            href="https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles"
          >
            Contrat de Gestion des Traitements de Données Personnelles
          </a>{' '}
          de Scalingo.
        </p>
      </Section>
    </Main>
  )
}
