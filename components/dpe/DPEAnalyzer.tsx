'use client'

import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import { useEffect, useState } from 'react'
import DPEAddressSearch from './DPEAddressSearch'
import { useSearchParams } from 'next/navigation'
import DPELabel from './DPELabel'
import { Card } from '../UI'
import { formatNumber } from '../RevenuInput'
import data from './DPE.yaml'
import Value from '../Value'
import { Key } from '../explications/ExplicationUI'

export function obtenirLettre(valeur, type) {
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i][type] <= valeur && valeur < data[i + 1][type]) {
      return data[i].lettre
    }
  }
  return data[data.length - 1].lettre
}

export default function DPEAnalyzer() {
  const engine = new Publicodes(rules)
  const [dpe, setDpe] = useState()
  const [xml, setXml] = useState()
  const [situation, setSituation] = useState()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const pourcentConso = (value) =>
    formatNumber((value / dpe['Conso_5_usages_é_primaire']) * 100) + '%'
  useEffect(() => {
    if (!dpe) return
    setSituation({
      'MPR . non accompagnée . éligible': 'oui',
      'CEE . conditions': 'oui',
      'gestes . isolation . murs intérieurs . MPR . surface': 50,
      'ménage . revenu . classe': "'très modeste'",
    })
    async function fetchDPE() {
      try {
        const response = await fetch(`/api/dpe?dpeNumber=${dpe['N°DPE']}`)
        if (!response.ok) throw new Error(`Error ${response.status}`)

        const text = await response.text()

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, 'application/xml')

        setXml((prev) => ({
          ...prev,
          descriptionMurs: Array.from(
            xmlDoc.querySelectorAll('mur donnee_entree description'),
          ).map((node) => node.textContent),
          plancher: Array.from(
            xmlDoc.querySelectorAll('plancher_bas donnee_entree description'),
          ).map((node) => node.textContent),
          plafond: Array.from(
            xmlDoc.querySelectorAll('plancher_haut donnee_entree description'),
          ).map((node) => node.textContent),
          baieVitree: Array.from(
            xmlDoc.querySelectorAll('baie_vitree donnee_entree description'),
          ).map((node) => node.textContent),
          porte: Array.from(
            xmlDoc.querySelectorAll('porte donnee_entree description'),
          ).map((node) => node.textContent),
          ventilation: Array.from(
            xmlDoc.querySelectorAll('ventilation donnee_entree description'),
          ).map((node) => node.textContent),
          travaux: Array.from(xmlDoc.querySelectorAll('pack_travaux')).map(
            (pack) => {
              const travauxNodes = Array.from(pack.querySelectorAll('travaux'))
              const uniqueTravauxMap = new Map()

              travauxNodes.forEach((trav) => {
                const lotId =
                  trav.querySelector('enum_lot_travaux_id')?.textContent ||
                  'N/A'
                if (
                  !uniqueTravauxMap.has(lotId) &&
                  trav.querySelector('description_travaux')?.textContent !=
                    'Sans'
                ) {
                  uniqueTravauxMap.set(lotId, {
                    id: lotId,
                    description: trav.querySelector('description_travaux')
                      ?.textContent,
                    performance: trav.querySelector('performance_recommande')
                      ?.textContent,
                    warning: trav.querySelector('avertissement_travaux')
                      ?.textContent,
                  })
                }
              })
              return {
                conso: pack.querySelector('conso_5_usages_apres_travaux')
                  ?.textContent,
                emission: pack.querySelector(
                  'emission_ges_5_usages_apres_travaux',
                )?.textContent,
                travaux: Array.from(uniqueTravauxMap.values()),
              }
            },
          ),
        }))
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchDPE()
  }, [dpe])

  return (
    <div
      css={`
        h2 {
          margin-left: 0;
          margin-right: 0;
        }
      `}
    >
      <DPEAddressSearch searchParams={searchParams} onSelectDpe={setDpe} />
      {dpe && (
        <>
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
                  <u>Chauffage:</u>
                  <br /> {Math.round(dpe['Conso_chauffage_é_primaire'])} soit
                  <strong>
                    {' '}
                    {pourcentConso(dpe['Conso_chauffage_é_primaire'])}
                  </strong>
                </div>
                <div>
                  <u>Eau chaude:</u>
                  <br /> {Math.round(dpe['Conso_ECS_é_primaire'])} soit
                  <strong> {pourcentConso(dpe['Conso_ECS_é_primaire'])}</strong>
                </div>
                <div>
                  <u>Auxiliaire:</u>
                  <br />
                  {Math.round(dpe['Conso_auxiliaires_é_primaire'])} soit
                  <strong>
                    {' '}
                    {pourcentConso(dpe['Conso_auxiliaires_é_primaire'])}
                  </strong>
                </div>
                <div>
                  <u>Eclairage:</u>
                  <br />
                  {Math.round(dpe['Conso_éclairage_é_primaire'])} soit
                  <strong>
                    {' '}
                    {pourcentConso(dpe['Conso_éclairage_é_primaire'])}
                  </strong>
                </div>
                <div>
                  <u>Climatisation:</u>
                  <br /> {Math.round(
                    dpe['Conso_refroidissement_é_primaire'],
                  )}{' '}
                  soit{' '}
                  <strong>
                    {pourcentConso(dpe['Conso_refroidissement_é_primaire'])}
                  </strong>
                </div>
              </Card>
              <Card>
                <h2>Emissions</h2>
                <div>
                  <u>Chauffage:</u>
                  <br />
                  <strong>
                    {Math.round(dpe['Emission_GES_chauffage_énergie_n°1'])}
                  </strong>
                </div>
                <div>
                  <u>Eau chaude:</u>
                  <br />
                  <strong>
                    {Math.round(dpe['Emission_GES_ECS_énergie_n°1'])}
                  </strong>
                </div>
                <div>
                  <u>Auxiliaire:</u>
                  <br />
                  <strong>{Math.round(dpe['Emission_GES_auxiliaires'])}</strong>
                </div>
                <div>
                  <u>Eclairage:</u>
                  <br />
                  <strong>{Math.round(dpe['Emission_GES_éclairage'])}</strong>
                </div>
                <div>
                  <u>Climatisation:</u>
                  <br />
                  <strong>
                    {Math.round(dpe['Emission_GES_refroidissement'])}
                  </strong>
                </div>
              </Card>
              <Card>
                <h2>Coûts</h2>
                <u>Chauffage:</u>
                <br /> <strong>{dpe['Coût_chauffage']}</strong>€
                <br />
                <u>Eau Chaude:</u>
                <br /> <strong>{dpe['Coût_ECS']}</strong>€
                <br />
                <u>Auxiliaire:</u>
                <br /> <strong>{dpe['Coût_auxiliaires']}</strong>€
                <br />
                <u>Eclairage:</u>
                <br /> <strong>{dpe['Coût_éclairage']}</strong>€
                <br />
                <u>Climatisation:</u>
                <br />
                <strong>{dpe['Coût_refroidissement']}</strong>€
              </Card>
              <Card>
                <h2>Confort d'été</h2>
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
                {dpe['Qualité_isolation_plancher_haut_toit_terrase'] && (
                  <div>
                    Toit terrasse:
                    <br />
                    <Badge
                      valeur={
                        dpe['Qualité_isolation_plancher_haut_toit_terrase']
                      }
                    />
                  </div>
                )}
                {dpe['Qualité_isolation_plancher_haut_comble_perdu'] && (
                  <div>
                    Comble perdu:
                    <br />
                    <Badge
                      valeur={
                        dpe['Qualité_isolation_plancher_haut_comble_perdu']
                      }
                    />
                  </div>
                )}
                {dpe['Qualité_isolation_plancher_haut_comble_aménagé'] && (
                  <div>
                    Comble aménagé:
                    <br />
                    <Badge
                      valeur={
                        dpe['Qualité_isolation_plancher_haut_comble_aménagé']
                      }
                    />
                  </div>
                )}
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
                  Plafond:{' '}
                  <strong>{dpe['Deperditions_planchers_hauts']}</strong>
                </div>
              </Card>
            </div>
          </div>
          <hr />
          <h2>Données du XML brut (informations moins structurées)</h2>
          <div
            css={`
              display: flex;
              gap: 0.5rem;
            `}
          >
            <Card>
              <h2>Enveloppe</h2>
              <u>Mur</u>
              <br />
              {xml?.descriptionMurs?.map((mur) => <div>{mur}</div>)}
              <u>Plancher & Plafond</u>
              <br />
              {xml?.plancher?.map((plancher) => <div>{plancher}</div>)}
              <u>Plafond</u>
              <br />
              {xml?.plafond?.map((plafond) => <div>{plafond}</div>)}
              <h2>Menuiserie</h2>
              <u>Fenêtres</u>
              <br />
              {xml?.baieVitree?.map((baieVitree) => <div>{baieVitree}</div>)}
              <u>Portes</u>
              <br />
              {xml?.porte?.map((porte) => <div>{porte}</div>)}
              <u>Ventilation</u>
              <br />
              {xml?.ventilation?.map((ventilation) => <div>{ventilation}</div>)}
            </Card>
            <Card>
              <h2>Travaux conseillés</h2>
              {xml?.travaux?.map((pack, i) => (
                <div key={i}>
                  <h4>Scénario {i + 1}:</h4>
                  <div
                    css={`
                      display: flex;
                      gap: 1rem;
                    `}
                  >
                    <p>
                      <strong>Consommation:</strong>{' '}
                      <DPELabel
                        label={obtenirLettre(Math.round(pack.conso), 'énergie')}
                      />
                    </p>
                    <p>
                      <strong>Émissions GES:</strong>
                      {Math.round(pack.emission) ? (
                        <DPELabel
                          label={obtenirLettre(
                            Math.round(pack.emission),
                            'climat',
                          )}
                        />
                      ) : (
                        '/'
                      )}
                    </p>
                  </div>
                  <ul>
                    {pack.travaux.map((trav, idx) => (
                      <li key={idx}>
                        <p>{trav.description}</p>
                        {trav.description.includes("murs par l'intérieur") && (
                          <Key $state="prime">
                            Mes aides:
                            <Value
                              {...{
                                engine,
                                situation,
                                dottedName:
                                  'gestes . isolation . murs intérieurs . montant',
                              }}
                            />
                          </Key>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          </div>
        </>
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
