import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import Ampleur from './Ampleur'
import { Suspense } from 'react'
export const metadata: Metadata = {
  title: 'API - Mes aides réno',
  description:
    "Découvrez la documentation de l'API de calcul des aides à la rénovation",
}

const iframeCode = `
<iframe src="https://mesaidesreno.beta.gouv.fr/module/integration" style="width: 400px; height: 700px; margin: 3rem auto; display: block; border: .2rem solid black; border-radius: 1rem; "></iframe>
`

export default function APIDoc() {
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
            <h2>Démonstration</h2>
            <Suspense>
              <Ampleur />
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
            <h2>Le résultat</h2>

            <div
              style={css`
                text-align: center;
                background: radial-gradient(
                  circle,
                  rgba(0, 0, 145, 0.2) 0%,
                  rgba(0, 212, 255, 0) 60%,
                  rgba(0, 212, 255, 0) 100%
                );
              `}
            >
              <p>[votre contenu]</p>
              <iframe
                src="https://mesaidesreno.beta.gouv.fr"
                style={css`
                  width: 400px;
                  height: 700px;
                  margin: 3rem auto;
                  display: block;
                  border: 0.2rem solid black;
                  border-radius: 1rem;
                  box-shadow:
                    rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
                    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
                `}
              ></iframe>
              <p>[la suite de votre contenu]</p>
            </div>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            <h2>Blabla</h2>
            <p>Mon gros blabla</p>
            <p>Super cool.</p>
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
