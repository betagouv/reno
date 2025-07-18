import DPE from '@/components/dpe/DPE'
import { Intro, PageBlock } from '@/components/UI'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

export const description = `Les passoires thermiques seront progressivement interdites à la location. Propriétaire bailleur, découvrez vos aides à la rénovation énergétique.`

export const metadata: Metadata = {
  title: 'Puis-je continuer de louer mon logement passoire thermique ?',
  description,
  openGraph: { images: ['/jaquette.png'] },
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
              alt: "Des ouvriers peignent et réparent la facade d'une maison",
            }}
          >
            <h1>Le DPE</h1>
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
          </HeaderWrapper>
          <Wrapper>
            <Content>
              <div>
                <DPE avecGES={true} avecLegend={true} />
              </div>
            </Content>
          </Wrapper>
        </PageBlock>
      </main>
    </>
  )
}
