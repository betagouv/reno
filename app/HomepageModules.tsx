'use client'
import { Card } from '@codegouvfr/react-dsfr/Card'
import useIsInIframe from '@/components/useIsInIframe'

export default function HomepageModules() {
  const isInIFrame = useIsInIframe()
  return (
    !isInIFrame && (
      <>
        <h2>Nos calculettes prêtes à l'emploi</h2>
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-4">
            <Card
              background
              border
              desc="Estimez la plus-value de votre logement après sa rénovation."
              enlargeLink
              imageAlt="Logo Plus Value"
              imageUrl="illuPlusValue.png"
              linkProps={{
                href: '/module/plus-value#',
              }}
              title="Ma plus-value Réno"
              titleAs="h3"
            />
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <Card
              background
              border
              desc="Calculez l'ensemble de vos aides pour une rénovation d'ampleur."
              enlargeLink
              imageAlt="Logo Rénovation d'ampleur"
              imageUrl="illuAmpleur.png"
              linkProps={{
                href: '/module',
              }}
              title="Rénovation d'ampleur"
              titleAs="h3"
            />
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <Card
              background
              border
              desc="Pompe à chaleur, éco-PTZ... Découvrez nos autres calculatrices
                spécialisées."
              enlargeLink
              imageAlt="Logo Calculatrice"
              imageUrl="illuModule.png"
              linkProps={{
                href: '/integration',
              }}
              title="Et bien plus encore..."
              titleAs="h3"
            />
          </div>
        </div>
      </>
    )
  )
}
