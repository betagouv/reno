'use client'
import Image from 'next/image'
import data from '@/components/dpe/DPE.yaml'
import { formatNumberWithSpaces } from '../utils'
import { formatNumber } from '../RevenuInput'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import Select from '../Select'
import editIcon from '@/public/crayon.svg'
import CalculatorWidget from '../CalculatorWidget'
import { encodeDottedName, getSituation } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const energies = [
  { valeur: '', titre: 'Aucune', prixMoyen: 0 },
  { valeur: 'électricité', titre: 'Électricité', prixMoyen: 0.2276 },
  { valeur: 'gaz', titre: 'Gaz naturel', prixMoyen: 0.0968 },
  { valeur: 'fioul', titre: 'Fioul', prixMoyen: 0.1 },
  { valeur: 'bois', titre: 'Bois – Bûches', prixMoyen: 0.04 },
  { valeur: 'granulés', titre: 'Granulés', prixMoyen: 0.07 },
  { valeur: 'propane', titre: 'Propane', prixMoyen: 0.13 },
  { valeur: 'charbon', titre: 'Charbon', prixMoyen: 0.072 },
]

const FactureWidget = ({
  engine,
  dpe,
  setSearchParams,
  answeredQuestions,
  isMobile,
}) => {
  const [pourcentagesAvantReno, setPourcentagesAvantReno] = useState([])
  const [pourcentagesApresReno, setPourcentagesApresReno] = useState([])
  const [energiesUtilisees, setEnergiesUtilisees] = useState([])
  const [montantFactureActuelle, setMontantFactureActuelle] = useState()
  const updatePourcentage = (index, value, setter) => {
    setter((prev) => prev.map((p, i) => (i === index ? value : p)))
  }

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  useEffect(() => {
    setEnergiesUtilisees(
      [1, 2, 3].map((i) =>
        energies.find((e) => e.titre === dpe[`Type_énergie_n°${i}`]),
      ),
    )

    const noDetail =
      dpe['Conso_5_usages_é_finale'] ===
        dpe['Conso_5_usages_é_finale_énergie_n°1'] &&
      dpe['Conso_5_usages_é_finale_énergie_n°1'] ===
        dpe['Conso_5_usages_é_finale_énergie_n°2']

    const pourcentageInitial = [1, 2, 3].map((i) =>
      dpe[`Conso_5_usages_é_finale_énergie_n°${i}`] > 0 && !noDetail
        ? Math.round(
            ((dpe[`Conso_5_usages_é_finale_énergie_n°${i}`] || 0) /
              dpe['Conso_5_usages_é_finale']) *
              100,
          )
        : '?',
    )
    console.log('pourcentageInitial', pourcentageInitial)
    setPourcentagesAvantReno(pourcentageInitial)
    setPourcentagesApresReno(pourcentageInitial)
    setMontantFactureActuelle(
      noDetail
        ? dpe['Coût_total_5_usages']
        : Math.round(
            energiesUtilisees.reduce(
              (total, energie, i) =>
                total +
                (energie?.prixMoyen || 0) *
                  (dpe[`Conso_5_usages_é_finale_énergie_n°${i + 1}`] || 0),
              0,
            ),
          ),
    )
  }, [dpe])

  const targetDPE = situation['projet . DPE visé']
  const moyenneConsoClasseDPE =
    (data[targetDPE]['énergie'] + data[targetDPE - 1]['énergie']) / 2

  const pourcentageEconomieVise =
    dpe['Conso_5_usages_par_m²_é_primaire'] / moyenneConsoClasseDPE
  const montantFactureEstime = montantFactureActuelle / pourcentageEconomieVise

  const EnergieTable = ({
    title,
    pourcentages,
    setPourcentages,
    energies,
    editable,
  }) => (
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
                  {pourcentages[index] != '?' && (
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
                            setPourcentages,
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
        <div>
          <div>
            <EnergieTable
              title="Actuellement :"
              pourcentages={pourcentagesAvantReno}
              setPourcentages={setPourcentagesAvantReno}
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
              setPourcentages={setPourcentagesApresReno}
              energies={energies}
              editable={true}
            />
          </div>
          <TargetDPETabs
            {...{
              oldIndex: situation['DPE . actuel'] - 1,
              setSearchParams,
              answeredQuestions,
              choice: situation['projet . DPE visé'] - 1,
              engine,
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
                  ${montantFactureEstime > 0
                    ? '--validColor1'
                    : '--warningColor'}
                );
                border: 2px solid var(--validColor) !important;
                border-radius: 0.3rem;
                color: var(
                  ${montantFactureEstime > 0 ? '--validColor' : '--darkColor'}
                );
                padding: 0.8rem;
                font-size: 110%;
              `}
            >
              {montantFactureEstime > 0 ? (
                <strong>
                  entre {formatNumber(0.9 * montantFactureEstime)}€ et{' '}
                  {formatNumber(1.1 * montantFactureEstime)}€
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

export default FactureWidget
