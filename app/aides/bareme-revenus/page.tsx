import { HeaderWrapper } from '@/app/LandingUI'
import TableauRevenus from '@/components/TableauRevenus'
import Questions from '@/components/TableauRevenusQuestions'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/bareme-revenu-illustration.jpeg'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Image from 'next/image'
import { Suspense } from 'react'

export const description = `Déterminez votre classe de revenu dans le tableau des seuils MaPrimeRénov', qui conditionne la plupart des aides à la rénovation énergétique.`
export const title = "Quelle est ma classe de revenu dans le barème de l'ANAH"

export const metadata: Metadata = {
  title,
  description,
  openGraph: { images: ['/bareme-revenu-illustration.jpeg'] },
}

export default function Page({ searchParams }) {
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
              {title}
            </h1>
            <Intro>
              <p>{description}</p>
            </Intro>
          </div>
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
  )
}
