'use client'
import Image from 'next/image'
import data from '@/components/dpe/DPE.yaml'
import { formatNumberWithSpaces } from '../utils'
import { formatNumber } from '../RevenuInput'
import DPEQuickSwitch from './DPEQuickSwitch'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import Select from '../Select'
import editIcon from '@/public/crayon.svg'
import CalculatorWidget from '../CalculatorWidget'
import {
  encodeDottedName,
  encodeSituation,
  getSituation,
} from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSetSearchParams from '../useSetSearchParams'
import { conversionLettreIndex } from './DPELabel'
import { fetchDPE } from './DPEPage'

const energies = [
  { valeur: '', titre: 'Aucune', prixMoyen: 0 },
  { valeur: 'électricité', titre: 'Électricité', prixMoyen: 0.2016 },
  { valeur: 'gaz', titre: 'Gaz naturel', prixMoyen: 0.13 },
  { valeur: 'fioul', titre: 'Fioul domestique', prixMoyen: 0.13 },
  { valeur: 'bois', titre: 'Bois – Bûches', prixMoyen: 0.04 },
  {
    valeur: 'boisForest',
    titre: 'Bois – Plaquettes forestières',
    prixMoyen: 0.04,
  },
  {
    valeur: 'boisIndus',
    titre: 'Bois – Plaquettes d’industrie',
    prixMoyen: 0.04,
  },
  {
    valeur: 'granulés',
    titre: 'Bois – Granulés (pellets) ou briquettes',
    prixMoyen: 0.07,
  },
  { valeur: 'gpl', titre: 'GPL', prixMoyen: 0.2 },
  { valeur: 'propane', titre: 'Propane', prixMoyen: 0.2 },
  { valeur: 'charbon', titre: 'Charbon', prixMoyen: 0.072 },
  {
    valeur: 'reseauChaleur',
    titre: 'Réseau de Chauffage urbain',
    prixMoyen: 0.08,
  },
]

const prixAbonnementElectricite = 160

export default function DPEFactureModule({ numDpe }) {
  const setSearchParams = useSetSearchParams()
  const [dpe, setDpe] = useState()
  const [pourcentagesAvantReno, setPourcentagesAvantReno] = useState([])
  const [pourcentagesApresReno, setPourcentagesApresReno] = useState([])
  const [energiesUtilisees, setEnergiesUtilisees] = useState([])
  const [montantFactureActuelle, setMontantFactureActuelle] = useState()
  const [montantFactureEstimee, setMontantFactureEstimee] = useState()
  const updatePourcentage = (index, value) => {
    setPourcentagesApresReno((prev) => {
      if (prev.length == 1) {
        return [value]
      }
      if (prev.length == 3) {
        return prev.map((p, i) => (i === index ? value : p))
      }
      return prev.map((p, i) => (i === index ? value : 100 - value))
    })
  }

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  useEffect(() => {
    async function fetchData() {
      setDpe(await fetchDPE(numDpe))
    }
    fetchData()
  }, [numDpe])

  useEffect(() => {
    const energiesUtilisees = [1, 2, 3]
      .map((i) => energies.find((e) => e.titre === dpe[`type_energie_n${i}`]))
      .filter(Boolean)
    setEnergiesUtilisees(energiesUtilisees)

    const noDetail =
      dpe['conso_5_usages_ef'] === dpe['conso_5_usages_ef_energie_n1'] &&
      dpe['conso_5_usages_ef_energie_n1'] ===
        dpe['conso_5_usages_ef_energie_n2']

    const pourcentageInitial = [1, 2, 3]
      .map((i) =>
        noDetail
          ? '?'
          : dpe[`conso_5_usages_ef_energie_n${i}`] > 0
            ? Math.round(
                ((dpe[`conso_5_usages_ef_energie_n${i}`] || 0) /
                  dpe['conso_5_usages_ef']) *
                  100,
              )
            : undefined,
      )
      .filter(Boolean)

    setPourcentagesAvantReno(pourcentageInitial)
    setPourcentagesApresReno(pourcentageInitial.map((e) => (e == '?' ? 0 : e)))
    setMontantFactureActuelle(
      noDetail
        ? dpe['cout_total_5_usages']
        : Math.round(
            energiesUtilisees.reduce(
              (total, energie, i) =>
                total +
                (energie?.prixMoyen || 0) *
                  (dpe[`conso_5_usages_ef_energie_n${i + 1}`] || 0),
              0,
            ),
          ),
    )
    setSearchParams(
      encodeSituation({
        'DPE . actuel': conversionLettreIndex.indexOf(dpe['etiquette_dpe']),
        'projet . DPE visé':
          conversionLettreIndex.indexOf(dpe['etiquette_dpe']) - 2,
      }),
    )
  }, [dpe])

  useEffect(() => {
    if (!situation['projet . DPE visé']) return
    const targetDPE = situation['projet . DPE visé']
    const moyenneConsoClasseDPE =
      (data[targetDPE]['énergie'] + data[targetDPE - 1]['énergie']) / 2

    const pourcentageEconomieVise =
      dpe['conso_5_usages_par_m2_ep'] / moyenneConsoClasseDPE

    // On calcule la répartition de la conso EF par énergie après rénovation
    const detailParEnergieEF = energiesUtilisees.map(
      (_, i) => (dpe['conso_5_usages_ef'] * pourcentagesApresReno[i]) / 100,
    )
    // On convertit en EP pour appliquer le pourcentage de gain inhérent au changement de classe
    const detailParEnergieEP = detailParEnergieEF.map(
      (value, i) =>
        (energiesUtilisees[i].valeur === 'électricité' ? value * 2.3 : value) /
        pourcentageEconomieVise,
    )
    // On reconvertit en EF pour appliquer le prix au kWh de l'énergie
    setMontantFactureEstimee(
      Math.round(
        detailParEnergieEP
          .map((val, i) => {
            return (
              (energiesUtilisees[i].valeur == 'électricité' ? val / 2.3 : val) *
              energiesUtilisees[i].prixMoyen
            )
          })
          .reduce((a, c) => a + c, 0) + prixAbonnementElectricite,
      ),
    )
  }, [pourcentagesApresReno, situation])

  const EnergieTable = ({ title, pourcentages, energies, editable }) => (
    <div>
      <div
        css={`
          font-weight: bold;
          text-align: center;
        `}
      >
        {title}
      </div>
      <table>
        {/* <thead>
          <tr>
            <th>Type</th>
            <th>Proportion</th>
          </tr>
        </thead> */}
        <tbody>
          {pourcentages.map((_, index) => {
            if (!energiesUtilisees[index]) return
            return (
              <tr key={index}>
                <td>
                  <Select
                    disableInstruction={false}
                    disabled={!editable}
                    value={energiesUtilisees[index]?.valeur}
                    values={energies}
                    onChange={() => {}}
                  />
                </td>
                <td>
                  {(pourcentages[index] != '?' || editable) && (
                    <div className="input-wrapper">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={!editable}
                        value={pourcentages[index]}
                        onChange={(e) =>
                          updatePourcentage(
                            index,
                            Math.max(0, Math.min(100, Number(e.target.value))),
                          )
                        }
                      />
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <CalculatorWidget>
      <div
        css={`
          display: flex;
          > div {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 50%;
          }
          table {
            margin: auto;
            th {
              font-weight: normal;
            }
            td {
              text-align: center;
              padding: 0.2rem;
            }
            input {
              height: 2.8em !important;
              width: 4rem !important;
              padding-right: 1rem !important;
              display: inline-block;
              margin: auto;
            }
            .input-wrapper::after {
              content: '%';
              position: absolute;
              transform: translateY(55%) translateX(-150%);
              pointer-events: none;
            }
            select {
              height: 2.8rem;
              background: #f5f5fe;
              max-width: 90vw;
            }
          }
        `}
      >
        <div
          css={`
            border-right: 1px solid black;
            padding-right: 1rem; /* Ajoute un espace à droite pour éviter que le contenu ne touche la bordure */
          `}
        >
          <div>
            <EnergieTable
              title="Actuellement :"
              pourcentages={pourcentagesAvantReno}
              energies={energies}
            />
          </div>
          <DPEQuickSwitch
            oldIndex={situation['DPE . actuel'] - 1}
            situation={situation}
            columnDisplay={true}
            editMode={true}
          />
          <div>
            <div>
              <span aria-hidden="true">💶</span> Facture actuelle estimée :
            </div>
            <div
              css={`
                margin: auto;
                margin-top: 0.5rem;
                border: 2px solid var(--color);
                width: 100%;
                color: var(--color);
                text-align: center;
                border-radius: 0.3rem;
                padding: 0.4rem;
                box-shadow: var(--shadow-elevation-medium);
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <div
                css={`
                  flex-grow: 1;
                `}
              >
                <input
                  id="facture-actuelle"
                  css={`
                    border: none !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    -webkit-appearance: none;
                    outline: none;
                    color: var(--color);
                    font-size: 110% !important;
                    max-width: 4rem;
                  `}
                  autoFocus={false}
                  placeholder="Facture actuelle annuelle estimée"
                  type="text"
                  inputMode="numeric"
                  pattern="\d+"
                  value={montantFactureActuelle}
                  onChange={(e) => {
                    const price = e.target.value.replace(/\s/g, '')
                    const startPos = e.target.selectionStart
                    const invalid = isNaN(price) || price <= 0
                    if (invalid) return
                    setSearchParams({
                      [encodeDottedName('facture . actuelle')]: price + '*',
                    })
                    e.target.value = formatNumberWithSpaces(price)
                    requestAnimationFrame(() => {
                      const inputFacture =
                        document.querySelector('#facture-actuelle')
                      inputFacture.selectionStart = startPos
                      inputFacture.selectionEnd = startPos
                    })
                  }}
                />
                <span title="Ce montant est estimée sur la base des informations fournies dans le DPE, vous pouvez l'ajuster à votre convenance">
                  €
                </span>
              </div>
              <Image
                css={`
                  cursor: pointer;
                  margin-left: auto;
                `}
                src={editIcon}
                alt="Icône crayon pour éditer"
                onClick={() =>
                  document.querySelector('#facture-actuelle').focus()
                }
              />
            </div>
          </div>
        </div>
        <div>
          <div>
            <EnergieTable
              title="Après rénovation :"
              pourcentages={pourcentagesApresReno}
              energies={energies}
              editable={true}
            />
          </div>
          <TargetDPETabs
            {...{
              oldIndex: situation['DPE . actuel'] - 1,
              setSearchParams,
              choice: situation['projet . DPE visé'] - 1,
              situation,
              columnDisplay: true,
            }}
          />
          <div>
            <div
              css={`
                margin: auto;
              `}
            >
              <span aria-hidden="true">💶</span> Après rénovation:
            </div>
            <div
              css={`
                margin-top: 0.5rem;
                text-align: center;
                background: var(
                  ${montantFactureEstimee > 0
                    ? '--validColor1'
                    : '--warningColor'}
                );
                border: 2px solid var(--validColor) !important;
                border-radius: 0.3rem;
                color: var(
                  ${montantFactureEstimee > 0 ? '--validColor' : '--darkColor'}
                );
                padding: 0.8rem;
                font-size: 110%;
              `}
            >
              {montantFactureEstimee > 0 ? (
                <strong>
                  entre {formatNumber(0.9 * montantFactureEstimee)}€ et{' '}
                  {formatNumber(1.1 * montantFactureEstimee)}€
                </strong>
              ) : (
                <small>
                  Veuillez renseigner les valeurs de la calculatrice pour
                  connaître le montant
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </CalculatorWidget>
  )
}
