'use client'

import { useState } from 'react'
import DpeAddressSearch from '../DpeAddressSearch'
import { useSearchParams } from 'next/navigation'
import DPELabel from './DPELabel'
import { Card } from '../UI'
import { formatNumber } from '../RevenuInput'

export default function DPEAnalyzer() {
  const [dpe, setDpe] = useState()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const pourcentConso = (value) =>
    formatNumber((value / dpe['Conso_5_usages_é_primaire']) * 100) + '%'
  console.log('dpe', dpe)
  return (
    <div
      css={`
        h2 {
          margin-left: 0;
          margin-right: 0;
        }
      `}
    >
      <DpeAddressSearch searchParams={searchParams} onSelectDpe={setDpe} />
      {dpe && (
        <div
          css={`
            h2 {
              margin: 1vh;
              color: var(--color);
              font-size: 120%;
            }
          `}
        >
          <div
            css={`
              display: flex;
              gap: 1rem;
            `}
          >
            <Card>
              <h2>Situation géographique</h2>
              <div>{dpe['Adresse_(BAN)']}</div>
              <div>{dpe["Complément_d'adresse_logement"]}</div>
              {dpe['N°_étage_appartement'] > 0 && (
                <div>{dpe['N°_étage_appartement']} étage</div>
              )}
            </Card>
            <Card>
              <h2>Analyse globale</h2>
              <div
                css={`
                  display: flex;
                  gap: 1rem;
                  justify-content: space-between;
                  div {
                    display: flex;
                    gap: 0.5rem;
                    flex-direction: column;
                    align-items: center;
                  }
                `}
              >
                <div>
                  <span>Etiquette</span>
                  <DPELabel label={dpe['etiquette']} small={false} />
                </div>
                <div>
                  <span>Consommation</span>
                  <DPELabel label={dpe['Etiquette_DPE']} small={false} />
                  <span>
                    {dpe['Conso_5_usages_par_m²_é_primaire']}
                    <small>kWh/m²/an</small>
                  </span>
                </div>
                <div>
                  <span>Emission GES</span>
                  <DPELabel label={dpe['Etiquette_GES']} small={false} />
                  <span>
                    {dpe['Emission_GES_5_usages_par_m²']}
                    <small>
                      kg CO<sub>2</sub>/m²/an
                    </small>
                  </span>
                </div>
              </div>
            </Card>
          </div>
          <div
            css={`
              display: flex;
              gap: 1rem;
            `}
          >
            <Card>
              <h2>Consommation</h2>
              <div>
                Chauffage: {Math.round(dpe['Conso_chauffage_é_primaire'])} (
                <strong>
                  {pourcentConso(dpe['Conso_chauffage_é_primaire'])}
                </strong>
                )
              </div>
              <div>
                Eau chaude: {Math.round(dpe['Conso_ECS_é_primaire'])} (
                <strong>{pourcentConso(dpe['Conso_ECS_é_primaire'])}</strong>)
              </div>
              <div>
                Auxiliaire: {Math.round(dpe['Conso_auxiliaires_é_primaire'])} (
                <strong>
                  {pourcentConso(dpe['Conso_auxiliaires_é_primaire'])}
                </strong>
                )
              </div>
              <div>
                Eclairage: {Math.round(dpe['Conso_éclairage_é_primaire'])} (
                <strong>
                  {pourcentConso(dpe['Conso_éclairage_é_primaire'])}
                </strong>
                )
              </div>
              <div>
                Climatisation:{' '}
                {Math.round(dpe['Conso_refroidissement_é_primaire'])} (
                <strong>
                  {pourcentConso(dpe['Conso_refroidissement_é_primaire'])}
                </strong>
                )
              </div>
            </Card>
            <Card>
              <h2>Emissions</h2>
              <div>
                Chauffage:{' '}
                <strong>
                  {Math.round(dpe['Emission_GES_chauffage_énergie_n°1'])}
                </strong>
              </div>
              <div>
                Eau chaude:{' '}
                <strong>
                  {Math.round(dpe['Emission_GES_ECS_énergie_n°1'])}
                </strong>
              </div>
              <div>
                Auxiliaire:{' '}
                <strong>{Math.round(dpe['Emission_GES_auxiliaires'])}</strong>
              </div>
              <div>
                Eclairage:{' '}
                <strong>{Math.round(dpe['Emission_GES_éclairage'])}</strong>
              </div>
              <div>
                Climatisation:{' '}
                <strong>
                  {Math.round(dpe['Emission_GES_refroidissement'])}
                </strong>
              </div>
            </Card>
            <Card>
              <h2>Coûts</h2>
              Chauffage: <strong>{dpe['Coût_chauffage']}</strong>€
              <br />
              Eau Chaude: <strong>{dpe['Coût_ECS']}</strong>€
              <br />
              Auxiliaire: <strong>{dpe['Coût_auxiliaires']}</strong>€
              <br />
              Eclairage: <strong>{dpe['Coût_éclairage']}</strong>€
              <br />
              Climatisation: <strong>{dpe['Coût_refroidissement']}</strong>€
            </Card>
          </div>
          <div
            css={`
              display: flex;
              gap: 1rem;
            `}
          >
            <Card
              css={`
                strong {
                  display: block;
                  margin-bottom: 1rem;
                }
              `}
            >
              <h2>Informations générales</h2>
              <div>
                N°DPE:
                <br /> <strong>{dpe['N°DPE']}</strong>
              </div>
              <div>
                Date d'établissement du DPE:
                <br />
                <strong>{dpe['Date_établissement_DPE']}</strong>
              </div>
              <div>
                Date de fin de validité du DPE:
                <br />
                <strong>{dpe['Date_fin_validité_DPE']}</strong>
              </div>
              <div>
                Type de batiment:
                <br /> <strong>{dpe['Type_bâtiment']}</strong>
              </div>
              <div>
                Période construction:
                <br />
                <strong>{dpe['Période_construction']}</strong>
              </div>
              <div>
                Surface habitable:
                <br />
                <strong>{dpe['Surface_habitable_logement']}m²</strong>
              </div>
              <div>
                Hauteur sous plafond:
                <br />
                <strong>{dpe['Hauteur_sous-plafond']}m</strong>
              </div>
              <div>
                Isolation toiture: <br />
                <strong>
                  {dpe['Isolation_toiture_(0/1)'] ? 'Oui' : 'Non'}
                </strong>
              </div>
              <div>
                Logement traversant: <br />
                <strong>
                  {dpe['Logement_traversant_(0/1)'] ? 'Oui' : 'Non'}
                </strong>
              </div>
              <u>Confort d'été</u>
              <div>
                Indicateur: <br />
                <strong>{dpe['Indicateur_confort_été']}</strong>
              </div>
              <div>
                Inertie lourde: <br />
                <strong>{dpe['Inertie_lourde_(0/1)'] ? 'Oui' : 'Non'}</strong>
              </div>
              <div>
                Présence brasseur d'air: <br />
                <strong>
                  {dpe['Présence_brasseur_air_(0/1)'] ? 'Oui' : 'Non'}
                </strong>
              </div>
              <div>
                Protection solaire: <br />
                <strong>
                  {dpe['Protection_solaire_exterieure'] ? 'Oui' : 'Non'}
                </strong>
              </div>
            </Card>
            <Card
              css={`
                > div {
                  margin-bottom: 0.5rem;
                }
              `}
            >
              <h2>Analyse du chauffage</h2>
              <div>
                <u>Eau chaude sanitaire</u>
                <br />
                Energie: <strong>{dpe['Type_énergie_principale_ECS']}</strong>
                <br />
                Générateur: <strong>{dpe['Type_générateur_ECS_n°1']}</strong>
                <br />
                Type: <strong>{dpe['Type_installation_ECS']}</strong>
                <br />
                Description:{' '}
                <strong>{dpe['Description_installation_ECS']}</strong>
                <br />
                Volume:{' '}
                <strong>{dpe['Volume_stockage_générateur_ECS_n°1']}</strong>
              </div>
              <div>
                <u>Chauffage</u>
                <br />
                Energie:{' '}
                <strong>{dpe['Type_énergie_principale_chauffage']}</strong>
                <br />
                Energie 2: <strong>{dpe['Type_énergie_n°2']}</strong>
                <br />
                Emetteur:{' '}
                <strong>
                  {dpe['Type_émetteur_installation_chauffage_n°1']}
                </strong>
                <br />
                Type: <strong>{dpe['Type_installation_chauffage']}</strong>
                <br />
                Description:{' '}
                <strong>
                  {' '}
                  {dpe['Description_installation_chauffage_n°1']}
                </strong>
              </div>
              <div>
                Besoin en chauffage:
                <br />
                <strong>{dpe['Besoin_chauffage']}</strong>
              </div>
              <div>
                Besoin en eau chaude:
                <br />
                <strong>{dpe['Besoin_ECS']}</strong>
              </div>
              <div>
                Besoin en climatisation:
                <br />
                <strong>{dpe['Besoin_refroidissement']}</strong>
              </div>
              <div>
                Apports solaire:
                <br />
                <strong>{dpe['Apports_solaires_saison_chauffe']}</strong>
              </div>
              <div>
                <span title="chaleur émise par les équipements électriques, l'équipement hydraulique, les occupants et leurs activités">
                  Apports internes:
                  <br />
                </span>
                <strong>{dpe['Apports_internes_saison_chauffe_']}</strong>
              </div>
              <div>
                Production d'électricité photovoltaïque:
                <br />
                <strong>{dpe['Production_électricité_PV_(kWhep/an)']}</strong>
              </div>
            </Card>
            <Card>
              <h2>Isolation</h2>
              <div>
                Enveloppe:
                <br /> <Badge valeur={dpe['Qualité_isolation_enveloppe']} />
              </div>
              <div>
                Menuiseries:
                <br />
                <Badge valeur={dpe['Qualité_isolation_menuiseries']} />
              </div>
              <div>
                Murs:
                <br /> <Badge valeur={dpe['Qualité_isolation_murs']} />
              </div>
              <div>
                Plancher:
                <br />
                <Badge valeur={dpe['Qualité_isolation_plancher_bas']} />
              </div>
              <div>
                Toit terrasse:
                <br />
                <Badge
                  valeur={dpe['Qualité_isolation_plancher_haut_toit_terrase']}
                />
              </div>
              <div>
                Comble perdu:
                <br />
                <Badge
                  valeur={dpe['Qualité_isolation_plancher_haut_comble_perdu']}
                />
              </div>
              <u>Déperditions</u>
              <div>
                Baies vitrées:{' '}
                <strong>{dpe['Deperditions_baies_vitrées']}</strong>
              </div>
              <div>
                Portes: <strong>{dpe['Déperditions_portes']}</strong>
              </div>
              <div>
                Ventilation:{' '}
                <strong>{dpe['Déperditions_renouvellement_air']}</strong>
              </div>
              <div>
                Enveloppe: <strong>{dpe['Deperditions_enveloppe']}</strong>
              </div>
              <div>
                Murs: <strong>{dpe['Déperditions_murs']}</strong>
              </div>
              <div>
                Pont thermiques:{' '}
                <strong>{dpe['Déperditions_ponts_thermiques']}</strong>
              </div>
              <div>
                Plancher: <strong>{dpe['Deperditions_planchers_bas']}</strong>
              </div>
              <div>
                Plafond: <strong>{dpe['Deperditions_planchers_hauts']}</strong>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export function Badge({ valeur }) {
  const color = {
    insuffisante: 'red',
    moyenne: 'orange',
    bonne: 'green',
    'très bonne': 'green',
  }
  return (
    <span
      css={`
        border: 1px solid black;
        box-shadow: var(--shadow-elevation-medium);
        display: inline-block;
        padding: 5px 10px;
        color: white;
        font-weight: bold;
        margin: 5px 0;
        border-radius: 10px;
        background: ${color[valeur]};
      `}
    >
      {valeur}
    </span>
  )
}
