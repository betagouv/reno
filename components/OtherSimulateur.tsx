'use client'

import Card from '@codegouvfr/react-dsfr/Card'

export default function OtherSimulateur({ mprAssocie = [], ceeAssocie }) {
  return (
    <>
      <h3>Ce n'est pas tout ! Simulez également :</h3>
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
          <Card
            background
            border
            enlargeLink
            linkProps={{
              href: '/simulation',
            }}
            size="medium"
            imageAlt="Sigle euro"
            imageUrl="/euro-entouré.svg"
            desc=""
            title="L'ensemble de vos aides à la rénovation"
            titleAs="h3"
          />
        </div>
        {mprAssocie &&
          mprAssocie.map((mpr) => (
            <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
              <Card
                background
                border
                enlargeLink
                linkProps={{
                  href: `/aides/ma-prime-renov/${encodeURIComponent(mpr)}`,
                }}
                imageAlt="Logo MaPrimeRénov'"
                imageUrl="/maprimerenov-logo.svg"
                size="medium"
                title={`Aides MaPrimeRénov' pour ${mpr}`}
                titleAs="h3"
              />
            </div>
          ))}
        {ceeAssocie && (
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <Card
              background
              border
              enlargeLink
              linkProps={{
                href: `/aides/cee/${ceeAssocie.code}/${encodeURIComponent(ceeAssocie.titre)}`,
              }}
              imageAlt="Logo CEE"
              imageUrl="/cee.svg"
              size="medium"
              title={`Aides CEE pour ${ceeAssocie.titre}`}
              titleAs="h3"
            />
          </div>
        )}
      </div>
    </>
  )
}
