import DPE from '@/components/dpe/DPE'
import { PageBlock } from '@/components/UI'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { HeaderWrapper } from '../LandingUI'
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
      <PageBlock>
        <HeaderWrapper
          image={{
            src: illustrationAccueil,
            alt: "Des ouvriers peignent et réparent la facade d'une maison",
          }}
        >
          <h1>Le DPE</h1>
          <p>
            En France hexagonale, le Diagnostic de Performance Énergétique
            informe sur la performance énergétique d'un logement.
          </p>
          <p>
            Depuis 2021, l'empreinte climat est prise en compte dans le calcul
            de la classe DPE. locataire un logement décent.
          </p>
          <p>
            Il est un critère clef pour la vente comme la location d'un logement
            .
          </p>
        </HeaderWrapper>
        <DPE avecGES={true} avecLegend={true} />
      </PageBlock>
    </>
  )
}
