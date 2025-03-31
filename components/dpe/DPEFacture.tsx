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

const FactureWidget = ({
  engine,
  dpe,
  setSearchParams,
  answeredQuestions,
  isMobile,
}) => {
  const energies = [
    { valeur: '', titre: 'Aucune', prixMoyen: 0 },
    { valeur: 'électricité', titre: 'Électricité', prixMoyen: 0.2276 },
    { valeur: 'gaz', titre: 'Gaz naturel', prixMoyen: 0.0968 },
    { valeur: 'fioul', titre: 'Fioul', prixMoyen: 0.1 },
    { valeur: 'bois', titre: 'Bois', prixMoyen: 0.04 },
    { valeur: 'granulés', titre: 'Granulés', prixMoyen: 0.07 },
    { valeur: 'propane', titre: 'Propane', prixMoyen: 0.13 },
    { valeur: 'charbon', titre: 'Charbon', prixMoyen: 0.072 },
  ]
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  const energie = energies.find((e) => e.titre == dpe['Type_énergie_n°1'])
  const energie2 = energies.find((e) => e.titre == dpe['Type_énergie_n°2'])
  let montantFactureActuelle = Math.round(
    energie?.prixMoyen * dpe['Conso_5_usages_é_finale'],
  )
  let percentEnergie1 =
    (dpe['Conso_5_usages_é_finale_énergie_n°1'] /
      dpe['Conso_5_usages_é_finale']) *
    100
  let percentEnergie2 = 0
  if (dpe['Conso_5_usages_é_finale_énergie_n°2']) {
    montantFactureActuelle = Math.round(
      energie?.prixMoyen * dpe['Conso_5_usages_é_finale_énergie_n°1'] +
        energie2?.prixMoyen * dpe['Conso_5_usages_é_finale_énergie_n°2'],
    )
    percentEnergie2 =
      (dpe['Conso_5_usages_é_finale_énergie_n°2'] /
        dpe['Conso_5_usages_é_finale']) *
      100
  }
  const targetDPE = situation['projet . DPE visé']
  const moyenneConsoClasseDPE =
    (data[targetDPE]['énergie'] + data[targetDPE - 1]['énergie']) / 2

  const pourcentageEconomieVise =
    dpe['Conso_5_usages_par_m²_é_primaire'] / moyenneConsoClasseDPE
  const montantFactureEstime = montantFactureActuelle / pourcentageEconomieVise

  return (
    <CalculatorWidget>
      <div
        css={`
          margin-bottom: 1rem;
          > div {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          table {
            th {
              font-weight: normal;
            }
            td {
              text-align: center;
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
          }
        `}
      >
        <div>
          <div>Facture actuelle estimée:</div>
          <div
            css={`
              height: 2.8rem;
              margin: auto;
              border: 2px solid var(--color);
              width: 10rem;
              color: var(--color);
              text-align: center;
              border-radius: 0.3rem;
              padding: 0.7rem;
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
                  -webkit-appearance: none !important;
                  outline: none !important;
                  color: var(--color);
                  font-size: 110% !important;
                  max-width: 6rem !important;
                  box-shadow: none !important;
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
        <div>
          <div>Energie actuelle:</div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Proportion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Select
                    css={`
                      height: 2.8rem;
                      background: #f5f5fe;
                      max-width: 90vw;
                    `}
                    disableInstruction={false}
                    onChange={(e) => {
                      setSearchParams({
                        [encodeDottedName('logement . type')]:
                          '"' + e.replaceAll("'", '') + '"*',
                      })
                    }}
                    value={energie?.valeur}
                    values={energies}
                  />
                </td>
                <td>
                  <div className="input-wrapper">
                    <input
                      value={formatNumber(percentEnergie1)}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </td>
              </tr>
              {energie2 && (
                <tr>
                  <td>
                    <Select
                      css={`
                        height: 2.8rem;
                        background: #f5f5fe;
                        max-width: 90vw;
                      `}
                      disableInstruction={false}
                      onChange={(e) => {
                        setSearchParams({
                          [encodeDottedName('logement . type')]:
                            '"' + e.replaceAll("'", '') + '"*',
                        })
                      }}
                      value={energie2?.valeur}
                      values={energies}
                    />
                  </td>
                  <td>
                    <div className="input-wrapper">
                      <input
                        value={formatNumber(percentEnergie2)}
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div>Après rénovation:</div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Proportion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Select
                    css={`
                      height: 2.8rem;
                      background: #f5f5fe;
                      max-width: 90vw;
                    `}
                    disableInstruction={false}
                    onChange={(e) => {
                      setSearchParams({
                        [encodeDottedName('logement . type')]:
                          '"' + e.replaceAll("'", '') + '"*',
                      })
                    }}
                    value={energie?.valeur}
                    values={energies}
                  />
                </td>
                <td>
                  <div className="input-wrapper">
                    <input
                      value={formatNumber(percentEnergie1)}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <Select
                    css={`
                      height: 2.8rem;
                      background: #f5f5fe;
                      max-width: 90vw;
                    `}
                    disableInstruction={false}
                    onChange={(e) => {
                      setSearchParams({
                        [encodeDottedName('logement . type')]:
                          '"' + e.replaceAll("'", '') + '"*',
                      })
                    }}
                    value={energie2?.valeur}
                    values={energies}
                  />
                </td>
                <td>
                  <div className="input-wrapper">
                    <input
                      value={formatNumber(percentEnergie2)}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        css={`
          display: flex;
          ${isMobile && 'flex-direction: column;'}
          justify-content: space-between;
          gap: 1rem;
        `}
      >
        <DPEQuickSwitch
          oldIndex={situation['DPE . actuel'] - 1}
          situation={situation}
          columnDisplay={true}
          editMode={true}
        />
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
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            ${isMobile && 'flex-direction: column;'}
            > div {
              display: flex;
              flex-direction: column;
              width: 100%;
            }
          `}
        >
          <div>
            <div
              css={`
                margin: auto;
              `}
            >
              <span aria-hidden="true">💶</span> Après rénovation, vous pourriez
              estimer une facture d'énergie:
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
                color: var(
                  ${montantFactureEstime > 0 ? '--validColor' : '--darkColor'}
                );
                padding: 0.5rem;
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
