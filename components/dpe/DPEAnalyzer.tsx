'use client'

import { useState } from 'react'
import DpeAddressSearch from '../DpeAddressSearch'
import { useSearchParams } from 'next/navigation'
import DPELabel from './DPELabel'
import { Card } from '../UI'
import { formatNumber } from '../RevenuInput'

export default function DPEAnalyzer() {
  const [dpe, setDpe] = useState({
    Conso_chauffage_dépensier_é_finale: 3306.6,
    'Volume_stockage_générateur_ECS_n°1': 0,
    Conso_é_finale_installation_ECS: 833,
    'Nom__commune_(BAN)': 'Bordeaux',
    Emission_GES_chauffage: 207.5,
    'Conso_ECS_é_finale_énergie_n°1': 833,
    Besoin_refroidissement: '0',
    'Conso_chauffage_dépensier_installation_chauffage_n°1': 3306.6,
    Coût_total_5_usages: 868.8,
    'Configuration_installation_chauffage_n°1':
      'Installation de chauffage simple',
    Conso_é_finale_dépensier_installation_ECS: 1175.1,
    Configuration_installation_ECS: "Un seul système d'ECS sans solaire",
    'Type_installation_chauffage_n°1': 'installation individuelle',
    'Surface_chauffée_installation_chauffage_n°1': 26.5,
    'Coordonnée_cartographique_X_(BAN)': 418813.86,
    Nombre_niveau_logement: 1,
    Apports_internes_saison_froid: 0,
    'Type_installation_ECS_(général)': 'individuel',
    Déperditions_murs: 26.4,
    'Conso_5_usages_par_m²_é_primaire': 325,
    Coût_refroidissement: 0,
    'Ubat_W/m²_K': 0.76,
    'Usage_générateur_ECS_n°1': 'ecs',
    Coût_ECS_dépensier: 192.9,
    Emission_GES_auxiliaires: 15.3,
    'Emission_GES_5_usages_par_m²': 10,
    Emission_GES_éclairage: 3.6,
    Apports_solaires_saison_froid: 0,
    Conso_ECS_dépensier_é_finale: 1175.1,
    'Adresse_(BAN)': '51 Rue Amédée Saint-Germain 33800 Bordeaux',
    Date_visite_diagnostiqueur: '2025-02-20',
    'N°_étage_appartement': 0,
    'Type_énergie_générateur_ECS_n°1': 'Électricité',
    Coût_ECS: 192.9,
    Surface_habitable_desservie_par_installation_ECS: 26.5,
    "Complément_d'adresse_logement": 'Etage RDC; Porte Gauche',
    Coût_éclairage: 12.1,
    Date_établissement_DPE: '2025-02-22',
    'Type_générateur_ECS_n°1': 'chauffe-eau électrique instantané',
    'Coût_total_5_usages_énergie_n°1': 868.8,
    'Description_installation_chauffage_n°1':
      'Radiateur électrique NFC, NF** et NF*** avec programmateur pièce par pièce (système individuel)',
    'N°_voie_(BAN)': '51',
    Besoin_ECS: '774,7',
    'N°DPE': '2533E0608156B',
    Conso_refroidissement_é_finale: 0,
    'Logement_traversant_(0/1)': true,
    Conso_chauffage_é_primaire: 6041.8,
    Adresse_brute: '51 Rue Amédée Saint-Germain',
    Conso_éclairage_é_primaire: 120.2,
    Qualité_isolation_menuiseries: 'moyenne',
    Qualité_isolation_murs: 'insuffisante',
    'Emission_GES_5_usages_énergie_n°1': 280.6,
    'Type_émetteur_installation_chauffage_n°1':
      'radiateur électrique NFC, NF** et NF***',
    Statut_géocodage: "adresse géocodée ban à l'adresse",
    Classe_inertie_bâtiment: 'Légère',
    'Emission_GES_ECS_énergie_n°1': 54.1,
    Nombre_appartement: 1,
    Modèle_DPE: 'DPE 3CL 2021 méthode logement',
    'Description_générateur_chauffage_n°1_installation_n°1':
      'Electrique - Radiateur électrique NFC, NF** et NF***',
    'Description_générateur_ECS_n°1':
      'Electrique - Chauffe eau électrique instantané',
    'Production_électricité_PV_(kWhep/an)': 0,
    Conso_5_usages_é_finale: 3751.2,
    Nombre_logements_desservis_par_installation_ECS: 1,
    'N°_département_(BAN)': '33',
    Conso_refroidissement_é_primaire: 0,
    Méthode_application_DPE: 'dpe appartement individuel',
    'N°_région_(BAN)': '75',
    Surface_habitable_logement: 26.5,
    'Code_postal_(brut)': '33800',
    Deperditions_planchers_bas: 11.4,
    'Coordonnée_cartographique_Y_(BAN)': 6420161.97,
    _rand: 272046,
    Période_construction: 'avant 1948',
    Emission_GES_ECS_dépensier: 54.1,
    'Emission_GES_chauffage_énergie_n°1': 207.5,
    'Conso_é_finale_dépensier_générateur_ECS_n°1': 1175.1,
    Emission_GES_refroidissement: 0,
    Classe_altitude: 'inférieur à 400m',
    Indicateur_confort_été: 'moyen',
    Description_installation_ECS: 'Chauffe eau électrique instantané',
    Emission_GES_ECS: 54.1,
    'Type_énergie_n°1': 'Électricité',
    Date_réception_DPE: '2025-02-23',
    'Coût_ECS_énergie_n°1': 192.9,
    Type_installation_ECS: 'installation individuelle',
    Conso_ECS_é_finale: 833,
    'Présence_brasseur_air_(0/1)': false,
    Qualité_isolation_plancher_haut_comble_perdu: 'très bonne',
    Emission_GES_5_usages: 280.6,
    'Code_postal_(BAN)': '33800',
    Conso_éclairage_é_finale: 52.3,
    Coût_refroidissement_dépensier: 0,
    Date_fin_validité_DPE: '2035-02-21',
    Deperditions_planchers_hauts: 0,
    Emission_GES_refroidissement_dépensier: 0,
    Type_bâtiment: 'appartement',
    Apports_solaires_saison_chauffe: 554.9,
    'Conso_chauffage_générateur_n°1_installation_n°1': 2626.9,
    Coût_chauffage: 608.4,
    Déperditions_renouvellement_air: 28.2,
    'Protection_solaire_exterieure_(0/1)': true,
    Déperditions_portes: 1.8,
    _geopoint: '44.823586958657835,-0.5583829809788369',
    'Conso_chauffage_installation_chauffage_n°1': 2626.9,
    Conso_ECS_dépensier_é_primaire: 1915.9,
    Zone_climatique_: 'H2c',
    Conso_refroidissement_dépensier_é_finale: 0,
    'Usage_générateur_n°1_installation_n°1': 'chauffage',
    Version_DPE: 2.4,
    Deperditions_baies_vitrées: 9.5,
    'Conso_chauffage_dépensier_générateur_n°1_installation_n°1': 3306.6,
    'Type_énergie_générateur_n°1_installation_n°1': 'Électricité',
    Déperditions_ponts_thermiques: 7.1,
    Type_installation_chauffage: 'individuel',
    Type_énergie_principale_chauffage: 'Électricité',
    'Inertie_lourde_(0/1)': false,
    Qualité_isolation_enveloppe: 'moyenne',
    Emission_GES_chauffage_dépensier: 207.5,
    Besoin_chauffage: 2961.8,
    'Isolation_toiture_(0/1)': false,
    Conso_ECS_é_primaire: 1915.9,
    Etiquette_GES: 'B',
    'Conso_5_usages_é_finale_énergie_n°1': 3751.2,
    "Complément_d'adresse_bâtiment": '227790',
    Conso_auxiliaires_é_primaire: 549.9,
    Conso_auxiliaires_é_finale: 239.1,
    'Conso_é_finale_générateur_ECS_n°1': 833,
    Conso_chauffage_é_finale: 2626.9,
    Coût_chauffage_dépensier: 608.4,
    Etiquette_DPE: 'E',
    Conso_refroidissement_dépensier_é_primaire: 0,
    Besoin_refroidissement_dépensier: 0,
    'Type_générateur_n°1_installation_n°1':
      'radiateur électrique NFC, NF** et NF***',
    'Coût_chauffage_énergie_n°1': 608.4,
    _i: 11225,
    Qualité_isolation_plancher_bas: 'insuffisante',
    Apports_internes_saison_chauffe_: 926.7,
    'Conso_5_usages/m²_é_finale': 141,
    'Hauteur_sous-plafond': 2.9,
    Identifiant__BAN: '33063_0225_00051',
    Coût_auxiliaires: 55.4,
    'Nom__rue_(BAN)': 'Rue Amédée Saint-Germain',
    Conso_chauffage_dépensier_é_primaire: 6041.8,
    'Code_INSEE_(BAN)': '33063',
    Score_BAN: 0.81,
    Deperditions_enveloppe: 84.3,
    Type_énergie_principale_ECS: 'Électricité',
    Conso_5_usages_é_primaire: 8627.9,
    'Conso_chauffage_é_finale_énergie_n°1': 2626.9,
    _id: 'l3fsx7rf_zE3Edjfn1Hrg',
    etage: 0,
    top: 15,
    base: 12,
    height: 3,
    etiquette: 'E',
    surface: 26.5,
    color: '#f0b50f',
  })
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  console.log(dpe)

  const consoTotale = dpe['Conso_5_usages_é_primaire']

  const pourcentConso = (value) =>
    formatNumber((value / consoTotale) * 100) + '%'

  return (
    <div>
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
                  justify-content: space-between;
                  div {
                    display: flex;
                    gap: 0.5rem;
                    flex-direction: column;
                    align-items: center;
                    span {
                      font-weight: bold;
                    }
                  }
                `}
              >
                <div>
                  <span>Classe globale</span>
                  <DPELabel label={dpe['etiquette']} small={false} />
                </div>
                <div>
                  <span>Consommation énergétique</span>
                  <DPELabel label={dpe['Etiquette_DPE']} small={false} />
                  <span>
                    {dpe['Conso_5_usages_par_m²_é_primaire']}
                    kWh/m²/an
                  </span>
                </div>
                <div>
                  <span>Emission de gaz à effet de serre</span>
                  <DPELabel label={dpe['Etiquette_GES']} small={false} />
                  <span>
                    {dpe['Emission_GES_5_usages_par_m²']}kg CO<sub>2</sub>/m²/an
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
              <h2>Détail de la consommation</h2>
              <ul>
                <li>
                  Chauffage: {dpe['Conso_chauffage_é_primaire']} soit{' '}
                  <strong>
                    {' '}
                    {pourcentConso(dpe['Conso_chauffage_é_primaire'])}
                  </strong>
                </li>
                <li>
                  Eau chaude sanitaire: {dpe['Conso_ECS_é_primaire']} soit{' '}
                  <strong> {pourcentConso(dpe['Conso_ECS_é_primaire'])}</strong>
                </li>
                <li>
                  Appareil électroménager: {dpe['Conso_auxiliaires_é_primaire']}{' '}
                  soit{' '}
                  <strong>
                    {' '}
                    {pourcentConso(dpe['Conso_auxiliaires_é_primaire'])}
                  </strong>
                </li>
                <li>
                  Climatisation: {dpe['Conso_refroidissement_é_primaire']} soit{' '}
                  <strong>
                    {' '}
                    {pourcentConso(dpe['Conso_refroidissement_é_primaire'])}
                  </strong>
                </li>
                <li>
                  Eclairage: {dpe['Conso_éclairage_é_primaire']} soit{' '}
                  <strong>
                    {' '}
                    {pourcentConso(dpe['Conso_éclairage_é_primaire'])}
                  </strong>
                </li>
              </ul>{' '}
            </Card>
            <Card>
              <h2>Détail des émissions</h2>
              <ul>
                <li>
                  Chauffage:{' '}
                  <strong>{dpe['Emission_GES_chauffage_énergie_n°1']}</strong>
                </li>
                <li>
                  Eau chaude sanitaire:{' '}
                  <strong>{dpe['Emission_GES_ECS_énergie_n°1']}</strong>
                </li>
                <li>
                  Autres (électroménager):{' '}
                  <strong>{dpe['Emission_GES_auxiliaires']}</strong>
                </li>
                <li>
                  Climatisation:{' '}
                  <strong>{dpe['Emission_GES_refroidissement']}</strong>
                </li>
                <li>
                  Eclairage: <strong>{dpe['Emission_GES_éclairage']}</strong>
                </li>
              </ul>
            </Card>
            <Card>
              <h2>Détail des déperditions</h2>
              <ul>
                <li>
                  Baies vitrées:
                  <strong>{dpe['Deperditions_baies_vitrées']}</strong>
                </li>
                <li>
                  Portes:
                  <strong>{dpe['Déperditions_portes']}</strong>
                </li>
                <li>
                  Ventilation:
                  <strong>{dpe['Déperditions_renouvellement_air']}</strong>
                </li>
                <li>
                  Enveloppe:
                  <strong>{dpe['Deperditions_enveloppe']}</strong>
                </li>
                <li>
                  Murs:
                  <strong>{dpe['Déperditions_murs']}</strong>
                </li>
                <li>
                  Pont thermiques:
                  <strong>{dpe['Déperditions_ponts_thermiques']}</strong>
                </li>
                <li>
                  Plancher:
                  <strong>{dpe['Deperditions_planchers_bas']}</strong>
                </li>
                <li>
                  Plafond:
                  <strong>{dpe['Deperditions_planchers_hauts']}</strong>
                </li>
              </ul>
            </Card>
          </div>
          <div
            css={`
              display: flex;
              gap: 1rem;
            `}
          >
            <Card>
              <h2>Informations générales</h2>
              <div>
                N°DPE: <strong>{dpe['N°DPE']}</strong>
              </div>
              <div>
                Date d'établissement du DPE:{' '}
                <strong>{dpe['Date_établissement_DPE']}</strong>
              </div>
              <div>
                Date de fin de validité du DPE:{' '}
                <strong>{dpe['Date_fin_validité_DPE']}</strong>
              </div>
              <div>
                Type de batiment: <strong>{dpe['Type_bâtiment']}</strong>
              </div>
              <div>
                Période construction:{' '}
                <strong>{dpe['Période_construction']}</strong>
              </div>
              <div>
                Surface habitable:{' '}
                <strong>{dpe['Surface_habitable_logement']}m²</strong>
              </div>
              <div>
                Hauteur sous plafond:{' '}
                <strong>{dpe['Hauteur_sous-plafond']}</strong>
              </div>
            </Card>
            <Card>
              <h2>Analyse du chauffage</h2>
              <ul>
                <li>
                  Système utilisé pour l'eau chaude sanitaire:{' '}
                  <strong>
                    {dpe['Type_installation_ECS']} -{' '}
                    {dpe['Description_installation_ECS']}
                  </strong>
                </li>
                <li>
                  Système utilisé pour le chauffage:{' '}
                  <strong>
                    {dpe['Type_installation_chauffage']} -{' '}
                    {dpe['Description_installation_chauffage_n°1']}
                  </strong>
                </li>
                <li>
                  Besoin en chauffage:{' '}
                  <strong>{dpe['Besoin_chauffage']}</strong>
                </li>
                <li>
                  Besoin en eau chaude sanitaire:{' '}
                  <strong>{dpe['Besoin_ECS']}</strong>
                </li>
                <li>
                  Besoin en climatisation:{' '}
                  <strong>{dpe['Besoin_refroidissement']}</strong>
                </li>
                <li>
                  Apports solaire:{' '}
                  <strong>{dpe['Apports_solaires_saison_chauffe']}</strong>
                </li>
                <li>
                  <span title="chaleur émise par les équipements électriques, l'équipement hydraulique, les occupants et leurs activités">
                    Apports internes:{' '}
                  </span>
                  <strong>{dpe['Apports_internes_saison_chauffe_']}</strong>
                </li>
                <li>
                  Production d'électricité photovoltaïque:{' '}
                  <strong>{dpe['Production_électricité_PV_(kWhep/an)']}</strong>
                </li>
              </ul>
            </Card>
            <Card>
              <h2>Analyse de l'isolation</h2>
              <ul>
                <li>
                  Enveloppe:{' '}
                  <Badge valeur={dpe['Qualité_isolation_enveloppe']} />
                </li>
                <li>
                  Menuiseries:{' '}
                  <Badge valeur={dpe['Qualité_isolation_menuiseries']} />
                </li>
                <li>
                  Murs: <Badge valeur={dpe['Qualité_isolation_murs']} />
                </li>
                <li>
                  Plancher:{' '}
                  <Badge valeur={dpe['Qualité_isolation_plancher_bas']} />
                </li>
                <li>
                  Toit terrasse:{' '}
                  <Badge
                    valeur={dpe['Qualité_isolation_plancher_haut_toit_terrase']}
                  />
                </li>
                <li>
                  Comble perdu:{' '}
                  <Badge
                    valeur={dpe['Qualité_isolation_plancher_haut_comble_perdu']}
                  />
                </li>
              </ul>
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
