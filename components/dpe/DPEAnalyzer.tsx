'use client'

import rules from '@/app/règles/rules'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useEffect, useState } from 'react'
import { formatNumber } from '../RevenuInput'
import { Card } from '../UI'
import Value from '../Value'
import { Key } from '../explications/ExplicationUI'
import useSetSearchParams from '../useSetSearchParams'
import data from './DPE.yaml'
import AddressSearch from '../AddressSearch'
import DPELabel from './DPELabel'
import DPEMap from './DPEMap'
import parseDpeXml from './parseDpeXml'

export function obtenirLettre(valeur, type) {
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i][type] <= valeur && valeur < data[i + 1][type]) {
      return data[i].lettre
    }
  }
  return data[data.length - 1].lettre
}

export default function DPEAnalyzer() {
  const setSearchParams = useSetSearchParams()
  const engine = new Publicodes(rules)
  const [dpe, setDpe] = useState()
  const [xml, setXml] = useState()
  const [situation, setSituation] = useState()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const [addressResults, setAddressResults] = useState(null)

  const pourcentConso = (value) =>
    formatNumber((value / dpe['conso_5_usages_ep']) * 100) + '%'
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

        setXml((prev) => ({
          ...prev,
          ...parseDpeXml(text),
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
      <AddressSearch
        {...{
          addressResults,
          setAddressResults,
        }}
        coordinates={[searchParams.lon, searchParams.lat]}
        setCoordinates={([lon, lat]) => setSearchParams({ lon, lat })}
      />

      <DPEMap
        searchParams={searchParams}
        onSelectDpe={setDpe}
        dpe={dpe}
        addressResults={addressResults}
        dpeListStartOpen={true}
      />
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
                <div>{dpe['adresse_ban']}</div>
                <div>{dpe['complement_adresse_logement']}</div>
                {dpe['numero_etage_appartement'] > 0 && (
                  <div>{dpe['numero_etage_appartement']} étage</div>
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
                    <DPELabel label={dpe['etiquette_dpe']} small={false} />
                    <span>
                      {dpe['conso_5_usages_par_m2_ep']}
                      <small>kWh/m²/an</small>
                    </span>
                  </div>
                  <div>
                    <span>Emission GES</span>
                    <DPELabel label={dpe['etiquette_ges']} small={false} />
                    <span>
                      {dpe['emission_ges_5_usages_par_m2']}
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
                  <br /> {Math.round(dpe['conso_chauffage_ep'])} soit
                  <strong> {pourcentConso(dpe['conso_chauffage_ep'])}</strong>
                </div>
                <div>
                  <u>Eau chaude:</u>
                  <br /> {Math.round(dpe['conso_ecs_ep'])} soit
                  <strong> {pourcentConso(dpe['conso_ecs_ep'])}</strong>
                </div>
                <div>
                  <u>Auxiliaire:</u>
                  <br />
                  {Math.round(dpe['conso_auxiliaires_ep'])} soit
                  <strong> {pourcentConso(dpe['conso_auxiliaires_ep'])}</strong>
                </div>
                <div>
                  <u>Eclairage:</u>
                  <br />
                  {Math.round(dpe['conso_eclairage_ep'])} soit
                  <strong> {pourcentConso(dpe['conso_eclairage_ep'])}</strong>
                </div>
                <div>
                  <u>Climatisation:</u>
                  <br /> {Math.round(dpe['conso_refroidissement_ep'])} soit{' '}
                  <strong>
                    {pourcentConso(dpe['conso_refroidissement_ep'])}
                  </strong>
                </div>
              </Card>
              <Card>
                <h2>Emissions</h2>
                <div>
                  <u>Chauffage:</u>
                  <br />
                  <strong>
                    {Math.round(dpe['emission_ges_chauffage_energie_n1'])}
                  </strong>
                </div>
                <div>
                  <u>Eau chaude:</u>
                  <br />
                  <strong>
                    {Math.round(dpe['emission_ges_ecs_energie_n1'])}
                  </strong>
                </div>
                <div>
                  <u>Auxiliaire:</u>
                  <br />
                  <strong>{Math.round(dpe['emission_ges_auxiliaires'])}</strong>
                </div>
                <div>
                  <u>Eclairage:</u>
                  <br />
                  <strong>{Math.round(dpe['emission_ges_eclairage'])}</strong>
                </div>
                <div>
                  <u>Climatisation:</u>
                  <br />
                  <strong>
                    {Math.round(dpe['emission_ges_refroidissement'])}
                  </strong>
                </div>
              </Card>
              <Card>
                <h2>Coûts</h2>
                <u>Chauffage:</u>
                <br /> <strong>{dpe['cout_chauffage']}</strong>€
                <br />
                <u>Eau Chaude:</u>
                <br /> <strong>{dpe['cout_ecs']}</strong>€
                <br />
                <u>Auxiliaire:</u>
                <br /> <strong>{dpe['cout_auxiliaires']}</strong>€
                <br />
                <u>Eclairage:</u>
                <br /> <strong>{dpe['cout_eclairage']}</strong>€
                <br />
                <u>Climatisation:</u>
                <br />
                <strong>{dpe['cout_refroidissement']}</strong>€
              </Card>
              <Card>
                <h2>Confort d'été</h2>
                <div>
                  Indicateur: <br />
                  <strong>{dpe['indicateur_confort_ete']}</strong>
                </div>
                <div>
                  Inertie lourde: <br />
                  <strong>{dpe['inertie_lourde'] ? 'Oui' : 'Non'}</strong>
                </div>
                <div>
                  Présence brasseur d'air: <br />
                  <strong>
                    {dpe['presence_brasseur_air'] ? 'Oui' : 'Non'}
                  </strong>
                </div>
                <div>
                  Protection solaire: <br />
                  <strong>
                    {dpe['protection_solaire_exterieure'] ? 'Oui' : 'Non'}
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
                  <br /> <strong>{dpe['numero_dpe']}</strong>
                </div>
                <div>
                  Date d'établissement du DPE:
                  <br />
                  <strong>{dpe['date_etablissement_dpe']}</strong>
                </div>
                <div>
                  Date de fin de validité du DPE:
                  <br />
                  <strong>{dpe['date_fin_validite_dpe']}</strong>
                </div>
                <div>
                  Type de batiment:
                  <br /> <strong>{dpe['type_batiment']}</strong>
                </div>
                <div>
                  Période construction:
                  <br />
                  <strong>{dpe['periode_construction']}</strong>
                </div>
                <div>
                  Surface habitable:
                  <br />
                  <strong>{dpe['surface_habitable_logement']}m²</strong>
                </div>
                <div>
                  Hauteur sous plafond:
                  <br />
                  <strong>{dpe['hauteur_sous_plafond']}m</strong>
                </div>
                <div>
                  Isolation toiture: <br />
                  <strong>{dpe['isolation_toiture'] ? 'Oui' : 'Non'}</strong>
                </div>
                <div>
                  Logement traversant: <br />
                  <strong>{dpe['logement_traversant'] ? 'Oui' : 'Non'}</strong>
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
                  Energie: <strong>{dpe['type_energie_principale_ecs']}</strong>
                  <br />
                  Générateur:{' '}
                  <strong>{dpe['type_generateur_n1_ecs_n1']}</strong>
                  <br />
                  Type: <strong>{dpe['type_installation_ecs']}</strong>
                  <br />
                  Description:{' '}
                  <strong>{dpe['description_installation_ecs_n1']}</strong>
                  <br />
                  Volume:{' '}
                  <strong>{dpe['volume_stockage_generateur_n1_ecs_n1']}</strong>
                </div>
                <div>
                  <u>Chauffage</u>
                  <br />
                  Energie:{' '}
                  <strong>{dpe['type_energie_principale_chauffage']}</strong>
                  <br />
                  Energie 2: <strong>{dpe['type_energie_n2']}</strong>
                  <br />
                  Emetteur:{' '}
                  <strong>
                    {dpe['type_emetteur_installation_chauffage_n1']}
                  </strong>
                  <br />
                  Type: <strong>{dpe['type_installation_chauffage']}</strong>
                  <br />
                  Description:{' '}
                  <strong>
                    {' '}
                    {dpe['description_installation_chauffage_n1']}
                  </strong>
                </div>
                <div>
                  Besoin en chauffage:
                  <br />
                  <strong>{dpe['besoin_chauffage']}</strong>
                </div>
                <div>
                  Besoin en eau chaude:
                  <br />
                  <strong>{dpe['besoin_ECS']}</strong>
                </div>
                <div>
                  Besoin en climatisation:
                  <br />
                  <strong>{dpe['besoin_refroidissement']}</strong>
                </div>
                <div>
                  Apports solaire:
                  <br />
                  <strong>{dpe['apport_solaire_saison_chauffe']}</strong>
                </div>
                <div>
                  <span title="chaleur émise par les équipements électriques, l'équipement hydraulique, les occupants et leurs activités">
                    Apports internes:
                    <br />
                  </span>
                  <strong>{dpe['apport_interne_saison_chauffe']}</strong>
                </div>
                <div>
                  Production d'électricité photovoltaïque:
                  <br />
                  <strong>
                    {dpe['production_electricite_pv_kwhep_par_an']}
                  </strong>
                </div>
              </Card>
              <Card>
                <h2>Isolation</h2>
                <div>
                  Enveloppe:
                  <br /> <Badge valeur={dpe['qualite_isolation_enveloppe']} />
                </div>
                <div>
                  Menuiseries:
                  <br />
                  <Badge valeur={dpe['qualite_isolation_menuiseries']} />
                </div>
                <div>
                  Murs:
                  <br /> <Badge valeur={dpe['qualite_isolation_murs']} />
                </div>
                <div>
                  Plancher:
                  <br />
                  <Badge valeur={dpe['qualite_isolation_plancher_bas']} />
                </div>
                {dpe['qualite_isolation_plancher_haut_toit_terrase'] && (
                  <div>
                    Toit terrasse:
                    <br />
                    <Badge
                      valeur={
                        dpe['qualite_isolation_plancher_haut_toit_terrase']
                      }
                    />
                  </div>
                )}
                {dpe['qualite_isolation_plancher_haut_comble_perdu'] && (
                  <div>
                    Comble perdu:
                    <br />
                    <Badge
                      valeur={
                        dpe['qualite_isolation_plancher_haut_comble_perdu']
                      }
                    />
                  </div>
                )}
                {dpe['qualite_isolation_plancher_haut_comble_amenage'] && (
                  <div>
                    Comble aménagé:
                    <br />
                    <Badge
                      valeur={
                        dpe['qualite_isolation_plancher_haut_comble_amenage']
                      }
                    />
                  </div>
                )}
                <u>Déperditions</u>
                <div>
                  Baies vitrées:{' '}
                  <strong>{dpe['deperditions_baies_vitrees']}</strong>
                </div>
                <div>
                  Portes: <strong>{dpe['deperditions_portes']}</strong>
                </div>
                <div>
                  Ventilation:{' '}
                  <strong>{dpe['deperditions_renouvellement_air']}</strong>
                </div>
                <div>
                  Enveloppe: <strong>{dpe['deperditions_enveloppe']}</strong>
                </div>
                <div>
                  Murs: <strong>{dpe['deperditions_murs']}</strong>
                </div>
                <div>
                  Pont thermiques:{' '}
                  <strong>{dpe['deperditions_ponts_thermiques']}</strong>
                </div>
                <div>
                  Plancher: <strong>{dpe['deperditions_planchers_bas']}</strong>
                </div>
                <div>
                  Plafond:{' '}
                  <strong>{dpe['deperditions_planchers_hauts']}</strong>
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
