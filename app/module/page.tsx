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
  title: 'API - Mes aides réno',
  description:
    "Découvrez la documentation de l'API de calcul des aides à la rénovation",
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
              prochainement pendant l'été et à la rentrée 2024 et ajouteront
              progressivement toutes les aides à la rénovation energétique.
            </p>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
