import { HeaderWrapper } from '@/app/LandingUI'
import TableauRevenus from '@/components/TableauRevenus'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Image from 'next/image'

export const description = `Déterminez votre classe de revenu, qui conditionne la plupart des aides à la rénovation énergétique`
export const title = "Quelle est ma classe de revenu dans le barème de l'ANAH"

export const metadata: Metadata = {
  title,
  description,
  //openGraph: { images: ['/jaquette.png'] },
}

export default function Page() {
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
            <TableauRevenus />
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
