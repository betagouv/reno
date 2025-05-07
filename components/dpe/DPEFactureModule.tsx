'use client'
import Image from 'next/image'
import data from '@/components/dpe/DPE.yaml'
import iconArgent from '@/public/icon-argent.png'
import listeEnergies from '@/app/règles/dpe/energies.publicodes'
import { formatNumber } from '../RevenuInput'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import Select from '../Select'
import informationIcon from '@/public/information.svg'
import CalculatorWidget from '../CalculatorWidget'
import { encodeSituation, getSituation } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSetSearchParams from '../useSetSearchParams'
import DPELabel from './DPELabel'
import { ModuleWrapper } from '@/app/module/ModuleWrapper'
import styled from 'styled-components'
import useDpe from './useDpe'
import { getIndexLettre } from './DPEPage'
import iconReduire from '@/public/reduire.svg'
import editIcon from '@/public/crayon.svg'

const prixAbonnementElectricite = 160

export default function DPEFactureModule({ type, numDpe }) {
  const dpe = useDpe(numDpe)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 400,
  )
  const setSearchParams = useSetSearchParams()
  const energies = listeEnergies['énergies . type']['une possibilité parmi'][
    'possibilités'
  ].map((e) => listeEnergies['énergie . ' + e])
  const [pourcentagesAvantReno, setPourcentagesAvantReno] = useState([])
  const [pourcentagesApresReno, setPourcentagesApresReno] = useState([])
  const [energiesUtilisees, setEnergiesUtilisees] = useState([])
  const [energiesUtiliseesApresReno, setEnergiesUtiliseesApresReno] = useState(
    [],
  )
  const [montantFactureActuelle, setMontantFactureActuelle] = useState()
  const [montantFactureInitial, setMontantFactureInitial] = useState()
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
    if (!dpe) return
    const energiesUtilisees = [1, 2, 3]
      .map((i) => {
        const dpeEnergie = dpe[`type_energie_n${i}`]
        return energies.find(
          (e) =>
            e['libellé DPE'] === dpeEnergie ||
            e['libellé DPE']['une possibilité parmi']?.[
              'possibilités'
            ]?.includes(dpeEnergie),
        )
      })
      .filter(Boolean)

    setEnergiesUtilisees(energiesUtilisees)
    setEnergiesUtiliseesApresReno(energiesUtilisees)

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
    const montantFactureInitial = noDetail
      ? dpe['cout_total_5_usages']
      : Math.round(
          energiesUtilisees.reduce(
            (total, energie, i) =>
              total +
              energie['prix moyen'] *
                (dpe[`conso_5_usages_ef_energie_n${i + 1}`] || 0),
            0,
          ),
        )
    setMontantFactureInitial(montantFactureInitial)
    setMontantFactureActuelle(montantFactureInitial)
    setSearchParams(
      encodeSituation({
        'DPE . actuel': getIndexLettre(dpe),
        'projet . DPE visé': Math.max(getIndexLettre(dpe) - 2, 1),
      }),
    )
  }, [dpe])

  useEffect(() => {
    const targetDPE = situation['projet . DPE visé']
    if (!targetDPE || !dpe) return
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
        (energiesUtilisees[i].titre === 'Électricité' ? value * 2.3 : value) /
        pourcentageEconomieVise,
    )
    const coefficientDeCorrection = montantFactureInitial
      ? montantFactureActuelle / montantFactureInitial
      : 1

    // On reconvertit en EF pour appliquer le prix au kWh de l'énergie
    setMontantFactureEstimee(
      Math.round(
        detailParEnergieEP
          .map((val, i) => {
            return (
              (energiesUtiliseesApresReno[i].titre == 'Électricité'
                ? val / 2.3
                : val) * energiesUtiliseesApresReno[i]['prix moyen']
            )
          })
          .reduce((a, c) => a + c, 0) + prixAbonnementElectricite,
      ) * coefficientDeCorrection,
    )
  }, [
    pourcentagesApresReno,
    energiesUtiliseesApresReno,
    montantFactureActuelle,
    situation,
  ])

  const EnergieTable = ({
    title,
    pourcentages,
    energies,
    energiesUtilisees,
    editable,
  }) => {
    const [showTable, setShowTable] = useState(false)
    return (
      <>
        <div
          css={`
            display: flex;
            justify-content: space-between;
          `}
        >
          <span
            css={`
              font-weight: bold;
            `}
          >
            {title}
          </span>{' '}
          <span
            css={`
              cursor: pointer;
              color: #0974f6;
              display: flex;
              align-items: center;
            `}
            onClick={() => setShowTable(!showTable)}
          >
            Détail
            <Image
              src={iconReduire}
              css={`
                margin-left: 0.5rem;
                ${!showTable && 'transform: rotate(180deg);'}
              `}
              alt="icone réduire"
            />
          </span>
        </div>
        {showTable && (
          <table
            css={`
              td {
                padding: 0.2rem;
              }
              input {
                height: 2.8em !important;
                width: 4rem !important;
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
            `}
          >
            <tbody>
              {pourcentages.map((_, index) => {
                if (!energiesUtilisees[index]) return
                return (
                  <tr key={index}>
                    <td>
                      <Select
                        disableInstruction={false}
                        disabled={!editable}
                        value={energiesUtilisees[index]?.titre}
                        values={energies}
                        onChange={(e) => {
                          const newEnergiesUtilisees = energiesUtilisees.map(
                            (energieUtilisee, i) =>
                              i === index
                                ? energies.find(
                                    (energie) => energie.titre === e,
                                  )
                                : energieUtilisee,
                          )
                          setEnergiesUtiliseesApresReno(newEnergiesUtilisees)
                        }}
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
                                Math.max(
                                  0,
                                  Math.min(100, Number(e.target.value)),
                                ),
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
        )}
      </>
    )
  }

  const MontantFacture = ({ montant, type }) => (
    <div>
      <div
        css={`
          display: flex;
          align-items: center;
          gap: 0.5rem;
        `}
      >
        <span aria-hidden="true">
          <Image src={iconArgent} width="20" alt="Icône billet" />
        </span>
        Facture estimée
        <span
          title={
            type == 'actuel'
              ? 'Ce montant est estimé sur la base des informations fournies dans le DPE, réajusté sur les prix actuels moyens des énergies'
              : "Ce montant n'est qu'une estimation"
          }
          css={`
            :hover {
              cursor: pointer;
            }
          `}
        >
          <Image src={informationIcon} width="20" alt="Icône information" />
        </span>
      </div>
      <div
        css={`
          margin-top: 0.5rem;
          text-align: center;
          background: var(
            ${type == 'actuel'
              ? '--lightestColor'
              : montant > 0
                ? '--validColor1'
                : '--warningColor'}
          );
          border: 2px solid
            var(${type == 'actuel' ? '--color' : '--validColor'}) !important;
          border-radius: 0.3rem;
          color: var(
            ${type == 'actuel'
              ? '--color'
              : montant > 0
                ? '--validColor'
                : '--darkColor'}
          );
          padding: 0.8rem;
          font-size: 110%;
        `}
      >
        {montant > 0 ? (
          <>
            {type != 'actuel' ? (
              <span>
                environ <strong>{formatNumber(montant)} €</strong>
              </span>
            ) : (
              <div
                css={`
                  display: flex;
                `}
              >
                <div
                  css={`
                    margin: auto;
                  `}
                >
                  environ
                  <input
                    id="facture-actuelle"
                    css={`
                      border: none;
                      font-weight: bold;
                      background: transparent;
                      -webkit-appearance: none;
                      outline: none;
                      color: var(--color);
                      font-size: 110%;
                      max-width: 4rem;
                      margin-left: 0.3rem;
                      padding: 0;
                    `}
                    autoFocus={false}
                    value={montantFactureActuelle}
                    placeholder="facture actuelle"
                    min="0"
                    max="9999"
                    onChange={(e) => {
                      const rawValue = e.target.value
                      const startPos = e.target.selectionStart
                      const value = +rawValue === 0 ? 0 : rawValue
                      setMontantFactureActuelle(value)
                      requestAnimationFrame(() => {
                        const inputBudget =
                          document.querySelector('#facture-actuelle')
                        inputBudget.selectionStart = startPos
                        inputBudget.selectionEnd = startPos
                      })
                    }}
                    step="1"
                  />
                  €
                </div>
                <Image
                  css={`
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                  `}
                  src={editIcon}
                  alt="Icône crayon pour éditer"
                  onClick={() =>
                    document.querySelector('#facture-actuelle').focus()
                  }
                />
              </div>
            )}
          </>
        ) : (
          <small>
            Veuillez renseigner les valeurs de la calculatrice pour connaître le
            montant
          </small>
        )}
      </div>
    </div>
  )

  const Wrapper = ({ type, children }) =>
    type === 'module' ? (
      <ModuleWrapper
        isMobile={isMobile}
        title="Estimer l'impact d'une rénovation sur ma facture d'énergie"
      >
        {children}
      </ModuleWrapper>
    ) : (
      <CalculatorWidget>{children}</CalculatorWidget>
    )

  return (
    <Wrapper type={type}>
      <DeuxColonnes $isMobile={isMobile}>
        <div>
          <div>
            <EnergieTable
              title="Actuellement :"
              pourcentages={pourcentagesAvantReno}
              energies={energies}
              energiesUtilisees={energiesUtilisees}
            />
          </div>
          <div
            css={`
              margin-left: 1rem;
            `}
          >
            DPE actuel :{' '}
            <DPELabel
              index={situation['DPE . actuel'] - 1}
              small={false}
              border={true}
            />
          </div>
          <MontantFacture
            montant={montantFactureActuelle}
            type="actuel"
            isMobile={isMobile}
          />
        </div>
        <div>
          <div>
            <EnergieTable
              title="Après rénovation :"
              pourcentages={pourcentagesApresReno}
              energies={energies}
              energiesUtilisees={energiesUtiliseesApresReno}
              editable={true}
            />
          </div>
          <div
            css={`
              margin-left: 1rem;
            `}
          >
            <TargetDPETabs
              {...{
                oldIndex: situation['DPE . actuel'] - 1,
                setSearchParams,
                choice: situation['projet . DPE visé'] - 1,
                situation,
                columnDisplay: false,
              }}
            />
          </div>
          <MontantFacture
            montant={montantFactureEstimee}
            type="futur"
            isMobile={isMobile}
          />
        </div>
      </DeuxColonnes>
    </Wrapper>
  )
}

export const DeuxColonnes = styled.div`
  display: flex;
  ${(p) => p.$isMobile && 'flex-direction: column;'}
  position: relative;
  gap: 2rem !important;
  &::after {
    content: '';
    position: absolute;
    top: ${(p) => (p.$isMobile ? '50%' : '0')};
    bottom: 0;
    left: ${(p) => (p.$isMobile ? '0' : '50%')};
    height: ${(p) => (p.$isMobile ? '1px' : '100%')};
    width: ${(p) => (p.$isMobile ? '100%' : '1px')};
    background-color: black;
    transform: ${(p) =>
      p.$isMobile ? 'translateY(-50%);' : 'translateX(-50%);'};
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-grow: 1;
    width: 100%;
  }
`
