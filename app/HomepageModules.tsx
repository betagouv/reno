'use client'
import { DsfrCard } from '@/components/UI'
import useIsInIframe from '@/components/useIsInIframe'

export default function HomepageModules() {
  const isInIFrame = useIsInIframe()
  return (
    !isInIFrame && (
      <>
        <h2>Nos calculettes prêtes à l'emploi</h2>
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--stretch fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-4">
            <DsfrCard
              titre="Ma plus-value Réno"
              url="/module/plus-value"
              description="Estimez la plus-value de votre logement après sa rénovation."
              imageUrl="/illuPlusValue.png"
              imageAlt="Illustration d'un calcul de plus-value immobilière"
              titleAs="h3"
            />
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <DsfrCard
              titre="Rénovation d'ampleur"
              url="/module"
              description="Calculez l'ensemble de vos aides pour une rénovation d'ampleur."
              imageUrl="/illuAmpleur.png"
              imageAlt="Illustration d'une rénovation d'ampleur"
              titleAs="h3"
            />
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <DsfrCard
              titre="Et bien plus encore..."
              url="/integration"
              description="Pompe à chaleur, éco-PTZ... Découvrez nos autres calculatrices
                spécialisées."
              imageUrl="/illuModule.png"
              imageAlt="Illustration d'une calculatrice"
              titleAs="h3"
            />
          </div>
        </div>
      </>
    )
  )
}
