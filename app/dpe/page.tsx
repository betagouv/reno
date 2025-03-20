import DPE from '@/components/dpe/DPE'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Image from 'next/image'
import { BlueEm, HeaderWrapper } from '../LandingUI'

export const description = `Les passoires thermiques seront progressivement interdites à la location. Propriétaire bailleur, découvrez vos aides à la rénovation énergétique.`

export const metadata: Metadata = {
  title: 'Puis-je continuer de louer mon logement passoire thermique ?',
  description,
  openGraph: { images: ['/jaquette.png'] },
}

export default function Page() {
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <div
        style={css`
          border: 2px solid red;
        `}
      >
        Page en réflection
      </div>
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
              Le DPE
            </h1>
            <Intro>
              <p>
                En France hexagonale, le Diagnostic de Performance Énergétique
                informe sur la performance énergétique d'un logement.{' '}
              </p>
              <p>
                Depuis 2021, l'empreinte climat est prise en compte dans le
                calcul de la classe DPE. locataire un logement décent.{' '}
              </p>
              <p>
                Il est un critère clef pour la <BlueEm>vente</BlueEm> comme la{' '}
                <BlueEm>location</BlueEm> d'un logement .
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <div>
              <DPE avecGES={true} />
            </div>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>Section 2</Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
