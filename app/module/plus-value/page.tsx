import { BlueEm, HeaderWrapper } from '@/app/LandingUI'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import plusValueImage from '@/public/illuPlusValue.png'
import Image from 'next/image'
import { Metadata } from 'next/types'
import { Suspense } from 'react'
import PlusValueModule from '@/components/module/PlusValueModule'
export const metadata: Metadata = {
  title:
    "Module de calcul de la plus value d'un logement suite à une rénovation - Mes aides réno",
  description: `Découvrez le module de calcul de la plus value d'un logement suite à une rénovation énergétique proposé par Mes Aides Réno"`,
}

export default function Module({}) {
  return (
    <main
      style={css`
        padding-top: 1.5vh;
      `}
    >
      <PageBlock>
        <HeaderWrapper>
          <Image
            src={plusValueImage}
            alt="Illustration du module plus value"
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
              <BlueEm>Plus value</BlueEm> d'un logement après rénovation
            </h1>
            <Intro>
              <p>
                Saviez-vous que la performance énergétique de votre logement
                influe fortement sur sa valeur immobilière ?
              </p>
              <p>
                Grâce à la calculette Ma plus-value Réno, estimez facilement
                l'impact de vos travaux de rénovation sur la valeur de votre
                bien.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper $background="white">
          <Content>
            <Suspense>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ margin: 'auto' }}>
                  <PlusValueModule type="module" />
                </div>
                <h2>Combien vaut mon logement après rénovation ?</h2>
                <p>
                  C'est pour répondre à cette question que le service public
                  numérique Mes Aides Réno propose la première calculette Ma
                  Plus-Value Réno, basée sur{' '}
                  <a
                    href="https://www.notaires.fr/fr/immobilier-fiscalite/etudes-et-analyses-immobilieres/performance-energetique-la-valeur-verte-des-logements"
                    target="_blank"
                  >
                    la dernière étude
                  </a>{' '}
                  Valeur verte des logements des Notaires de France.
                </p>
                <h2>Comment est financé cet outil ?</h2>
                <p>
                  L'équipe derrière la calculette, c'est l'équipe de Mes Aides
                  Réno. Il s'agit d'un simulateur officiel des aides à la
                  rénovation des logements, financé exclusivement sur fonds
                  publics (Anah, DINUM, SGPE). Ce financement public permet de
                  proposer des outils neutres et gratuits, au service des
                  usagers et des professionnels.
                </p>
                <h2>
                  Comment intégrer la calculette Ma plus-value Réno sur une page
                  web ?
                </h2>
                <p>
                  La calculette peut être{' '}
                  <a href={`/module/plus-value/demonstration`}>intégrée</a> sur
                  n'importe quelle page web ou article en 3 minutes. Le
                  communiqué de presse sur la calculette Ma plus-value Réno est{' '}
                  <a href="https://mesaidesreno.notion.site/" target="_blank">
                    disponible ici
                  </a>
                  .
                </p>
              </div>
            </Suspense>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
