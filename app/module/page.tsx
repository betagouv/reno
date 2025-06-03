import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import ampleurImage from '@/public/illuAmpleur.png'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import Demonstration from './Demonstration'
import { Suspense } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
export const metadata: Metadata = {
  title: "Module d'aide à la rénovation énergétique - Mes aides réno",
  description: `Découvrez le module de calcul des aides à la rénovation énergétique de Mes Aides Réno"`,
}

export default function Module({}) {
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <Content>
          <Breadcrumb
            links={[
              { 'Devenir partenaire': '/devenir-partenaire' },
              { 'Les iframes': '/integration' },
              { "Rénovation d'ampleur": '/module' },
            ]}
          />
        </Content>
        <HeaderWrapper>
          <Image
            src={ampleurImage}
            alt="Illustration du module ampleur"
            style={css`
              margin: 1rem;
            `}
          />
          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              <BlueEm>Module de calcul</BlueEm> des aides à la rénovation
              énergétique
            </h1>
            <Intro>
              <p>
                Mes Aides Réno est un service public de calcul des aides à la
                rénovation energétique. Le sujet est complexe, les aides sont
                multiples, les règles sont mouvantes.
              </p>
              <p>
                En intégrant directement notre calculateur sous forme d'iframe
                chez vous, vous permettez à vos utilisateurs de calculer leurs
                aides sans qu'ils quittent votre site.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>

        <Wrapper>
          <Content>
            <Suspense>
              <Demonstration moduleName="ampleur" />
            </Suspense>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            <h2>Toujours à jour</h2>
            <p>
              En intégrant dès maintenant le calculateur sur votre site, vous
              profiterez automatiquement des mises à jour qui ont lieu au cours de l'année et surtout aux importantes mises à jour annuelles.
            </p>
            <h2>Historique des versions</h2>
            <h3>v1 (été 2024)</h3>
            <p>
              La première version "preuve de concept" du module. Elle n'intègre
              que le dispositif principal MaPrimeRénov' parcours ampleur.{' '}
            </p>
            <h3>v2 (septembre 2024)</h3>
            <p>
              Le module est redesigné suite aux premiers retours du premier
              intégrateur. Les saisies utilisateur sont améliorées avec un choix
              simple dans un menu déroulant pour décrire la situation de
              l'acheteur : résidence principale, résidence secondaire ou
              résidence principale d'un locataire.
            </p>
            <p>
              Il inclut non seulement MaPrimeRénov' ampleur mais aussi les
              autres aides principales dont l'éco-PTZ, le Prêt Avance Rénovation
              à zéro %, le dispositif Denormandie, etc.
            </p>
            <h3>v3 (fin novembre 2024)</h3>
            <p>
              Dans cette nouvelle version, nous réduisons la charge de
              l'utilisateur pour l'aider à remplir les questions :{' '}
              <strong>les 4 questions s'affichent désormais une par une</strong>
              , tout en gardant les 4 visibles dès le départ pour qu'il n'y ait
              aucune surprise.{' '}
            </p>
            <p>
              La saisie du revenu ne se fait plus à l'euro près de façon libre,
              mais via des <strong>seuils de revenu calculés</strong> en
              fonction des 3 réponses précédentes, pour éviter ainsi à
              l'utilisateur de devoir aller chercher sa déclaration d'impôt et
              craindre cette saisie sensible quand elle est trop précise.
            </p>
            <p>
              Autre nouveauté : les 4 réponses utilisateur sont mises en
              mémoire, pour qu'il ou elle n'ait pas à répéter ces informations
              d'une annonce à l'autre.{' '}
            </p>
            <div>
              Enfin, au clic sur "Découvrir toutes les aides" :{' '}
              <ul>
                <li>
                  les données injectées par l'annonce (m2, ville, maison/appart)
                  et le module (motif d'achat, revenu, etc.) sont auto-remplies
                  pour raccourcir la simulation et amener l'utilisateur au plus
                  vite vers la page de bilan des aides
                </li>
                <li>
                  un message l'avertit de ce procédé pour lui faire comprendre
                  que ces données sont bien prises en compte dans la simulation
                </li>
              </ul>
            </div>
            <p>
              <small>
                Pour tous les détails, c'est{' '}
                <a href="https://github.com/betagouv/reno/pull/281">par ici</a>{' '}
                : tout notre développement est ouvert.
              </small>
            </p>
            <h4>v4 (mi-février 2025)</h4>
            <p>
              Dans cette nouvelle version, le changement majeur est la fin de
              l'affichage de résultats <em>avant</em> une première réponse à
              toutes les questions du module.
            </p>
            <p>
              En effet, nos tests utilisateurs nous avaient permi d'identifier
              que l'utilisateur ne comprenait souvent pas que ses réponses
              changeaient les chiffres car ils se mettaient à jour
              instantanément, donc discrètement.
            </p>
            <p>
              Au passage, fini le risque de mal informer l'utilisateur distrait,
              l'oeil attiré par les résultats verts en milliers d'€, avec des
              aides moyennes auxquelles il n'a pas accès donc avec un potentiel
              de déception important.
            </p>
            <p>
              Autre changement notable : nous ne posons plus la question du DPE
              cible. Nous prenons une hypothèse d'un saut de DPE suffisant pour
              obtenir MaPrimeRénov' et mentionnons cela tout en bas : la
              simulation complète permettra à l'utilisateur de comprendre ces
              enjeux dans un second temps, peu pertinent pendant la phase de
              recherche de logement.
            </p>
            <p>
              Nous avons également ajouté le logo officiel de la République
              Française en-tête pour donner confiance aux utilisateurs, et
              relégé les logos secondaires en bas. Un liseré bleu vient mieux
              segmenter le module du reste de la page hôte.
            </p>
            <p>
              Finalement, nous avons corrigé quelques problèmes subsidiaires :
              l'utilisateur peut maintenant revenir sur le module quand il
              l'avait quitté via le bouton "Affiner" ; la couleur de l'un des
              champs de saisie différait des autres ; l'affichage des résultats
              était moins lisible sans organisation de type tableau à deux
              colonnes ; nous avons clarifié la question "Île de France" en
              évitant l'approche par la négative, même si cela occupe une
              nouvelle ligne verticale.
            </p>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
