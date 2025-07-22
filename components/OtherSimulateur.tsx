'use client'

import Card from '@codegouvfr/react-dsfr/Card'
import { DsfrCard } from './UI'

export default function OtherSimulateur({ mprAssocie = [], ceeAssocie }) {
  return (
    <>
      <h3 className="fr-mt-5v">Ce n'est pas tout ! Simulez également :</h3>
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--stretch fr-mb-5v">
        <div className="fr-col-12 fr-col-sm-6 fr-col-md-3">
          <DsfrCard
            url="/simulation"
            imageAlt="Sigle euro"
            imageUrl="/euro-entouré.svg"
            titre="L'ensemble de vos aides à la rénovation"
            titleAs="h3"
          />
        </div>
        {mprAssocie &&
          mprAssocie.map((mpr, i) => (
            <div key={i} className="fr-col-12 fr-col-sm-6 fr-col-md-3">
              <DsfrCard
                url={`/aides/ma-prime-renov/${encodeURIComponent(mpr)}`}
                imageAlt="Logo MaPrimeRénov'"
                imageUrl="/maprimerenov.svg"
                titre={`Aides MaPrimeRénov' pour ${mpr}`}
                titleAs="h3"
              />
            </div>
          ))}
        {ceeAssocie && (
          <div className="fr-col-12 fr-col-sm-6 fr-col-md-3">
            <DsfrCard
              url={`/aides/cee/${ceeAssocie.code}/${encodeURIComponent(ceeAssocie.titre)}`}
              imageAlt="Logo CEE"
              imageUrl="/cee.svg"
              titre={`Aides CEE pour ${ceeAssocie.titre}`}
              titleAs="h3"
            />
          </div>
        )}
      </div>
    </>
  )
}
