import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import AmpleurDemonstration from './AmpleurDemonstration'
import { Suspense } from 'react'
export const metadata: Metadata = {
  title: 'Module passoire thermique - Mes aides réno',
  description: `Découvrez le module de calcul "passoire thermique" de Mes Aides Réno"`,
}

const iframeCode = `
<iframe src="https://mesaidesreno.beta.gouv.fr/module/integration" style="width: 720px; height: 800px; margin: 3rem auto; display: block; border-radius: 0.4rem; --shadow-color: 0deg 0% 63%;
              --shadow-elevation-medium: 0.3px 0.5px 0.7px
                  hsl(var(--shadow-color) / 0.36),
                0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
                2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
                5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
              box-shadow: var(--shadow-elevation-medium);

"></iframe>
`

export default function Module({}) {
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <HeaderWrapper>
          <Image
            src={illustrationAccueil}
            alt="Des ouvriers peignent et réparent la facade d'une maison"
          />

          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              <BlueEm>Module de calcul</BlueEm> d'aide pour un achat de passoire
              thermique
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
              <AmpleurDemonstration />
            </Suspense>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            <h2>Comment l'intégrer ?</h2>
            <p>
              Voici{' '}
              <BlueEm>
                <strong>le code à intégrer</strong>
              </BlueEm>{' '}
              dans votre HTML ou votre contenu Wordpress :
            </p>
            <code>{iframeCode}</code>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            <h2>Toujours à jour</h2>
            <p>
              En intégrant dès maintenant le calculateur sur votre site, vous
              profiterez automatiquement des mises à jour qui auront lieu très
              prochainement en janvier 2025.
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
            <h4>v4 (à venir)</h4>
            <p>
              Pour la v4, à nouveau suite à des tests utilisateurs, nous allons
              travailler l'affichage des résultats chiffrés dans le module.
            </p>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
