import { HeaderWrapper } from '@/app/LandingUI'
import TableauRevenus from '@/components/TableauRevenus'
import Questions from '@/components/TableauRevenusQuestions'
import { Intro, PageBlock } from '@/components/UI'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/bareme-revenu-illustration.jpeg'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { Suspense } from 'react'

export const description = `Déterminez votre classe de revenu dans le tableau des seuils MaPrimeRénov', qui conditionne la plupart des aides à la rénovation énergétique.`
export const title = "Quelle est ma classe de revenu dans le barème de l'Anah"

export const metadata: Metadata = {
  title,
  description,
  openGraph: { images: ['/bareme-revenu-illustration.jpeg'] },
}

export default function Page() {
  return (
    <>
      <StartDsfrOnHydration />
      <main>
        <PageBlock>
          <HeaderWrapper
            image={{
              src: illustrationAccueil,
              alt: 'Image représentant un graphique',
            }}
          >
            <h1>{title}</h1>
            <Intro>
              <p>{description}</p>
            </Intro>
          </HeaderWrapper>
          <Wrapper>
            <Content>
              <Suspense>
                <Questions />
                <TableauRevenus dottedName={'ménage . revenu . barème'} />
                <TableauRevenus dottedName={'ménage . revenu . barème IdF'} />
              </Suspense>
            </Content>
          </Wrapper>
        </PageBlock>
      </main>
    </>
  )
}
