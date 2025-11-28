'use client'
import Image from 'next/image'
import data from '@/components/dpe/DPE.yaml'
import iconArgent from '@/public/icon-argent.png'
import listeEnergies from '@/app/règles/energies.publicodes'
import { formatNumber } from '../RevenuInput'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import informationIcon from '@/public/information.svg'
import CalculatorWidget from '../CalculatorWidget'
import { encodeSituation, getSituation } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useMemo, useCallback } from 'react'
import useSetSearchParams from '../useSetSearchParams'
import DPELabel, { conversionLettreIndex } from './DPELabel'
import { ModuleWrapper } from '@/app/module/ModuleWrapper'
import styled from 'styled-components'
import useDpe from './useDpe'
import { getIndexLettre } from './DPEPage'
import iconReduire from '@/public/reduire.svg'
import editIcon from '@/public/crayon.svg'
import { push } from '@socialgouv/matomo-next'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import Select from '@codegouvfr/react-dsfr/Select'
import useIsMobile from '../useIsMobile'

const prixAbonnementElectricite = 160
export const getIndexLettre = (dpe) =>
  conversionLettreIndex.indexOf(
    conversionLettreIndex.indexOf(dpe['etiquette_dpe']) >
      conversionLettreIndex.indexOf(dpe['etiquette_ges'])
      ? dpe['etiquette_dpe']
      : dpe['etiquette_ges'],
  ) + 1

export default function DPEFactureModule({ type, numDpe }) {
  const dpe = useDpe(numDpe)
  const [showTable, setShowTable] = useState(false)
  const isMobile = useIsMobile(400)
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

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module Facture'])
  }, [])
  const updatePourcentage = useCallback((index, value) => {
    push(['trackEvent', 'Module', 'Interaction', 'Modifie Pourcentage'])
    setPourcentagesApresReno((prev) =>
      prev.length == 1
        ? [value]
        : prev.length == 3
          ? prev.map((p, i) => (i === index ? value : p))
          : prev.map((p, i) => (i === index ? value : 100 - value)),
    )
  }, [])

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

  const EnergieTable = useMemo(
    () =>
      ({
        title,
        pourcentages,
        energies,
        energiesUtilisees,
        editable,
        showTable,
        setShowTable,
      }) => {
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
                onClick={() => {
                  push(['trackEvent', 'Module', 'Page', 'Affiche détail'])
                  setShowTable(!showTable)
                }}
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
                `}
              >
                <tbody>
                  {pourcentages.map((_, index) => {
                    if (!energiesUtilisees[index]) return
                    return (
                      <tr key={index}>
                        <td>
                          <Select
                            nativeSelectProps={{
                              onChange: (e) => {
                                const newEnergiesUtilisees =
                                  energiesUtilisees.map((energieUtilisee, i) =>
                                    i === index
                                      ? energies.find(
                                          (energie) =>
                                            energie.titre === e.target.value,
                                        )
                                      : energieUtilisee,
                                  )
                                setEnergiesUtiliseesApresReno(
                                  newEnergiesUtilisees,
                                )
                              },
                              value: energiesUtilisees[index]?.titre,
                            }}
                            disabled={!editable}
                          >
                            {energies.map((e, i) => (
                              <option key={i} value={e.valeur}>
                                {e.titre}
                              </option>
                            ))}
                          </Select>
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
      },
    [updatePourcentage, energiesUtiliseesApresReno],
  )

  const MontantFacture = useMemo(
    () =>
      ({ montant, type }) => (
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
                          push([
                            'trackEvent',
                            'Module',
                            'Interaction',
                            'Modifie Facture actuelle',
                          ])
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
                Veuillez renseigner les valeurs de la calculatrice pour
                connaître le montant
              </small>
            )}
          </div>
        </div>
      ),
    [montantFactureActuelle],
  )

  const Wrapper = useMemo(
    () =>
      ({ type, children }) =>
        type === 'module' ? (
          <ModuleWrapper title="Estimer l'impact d'une rénovation sur ma facture d'énergie">
            {children}
            <AmpleurCTA
              situation={situation}
              isMobile={isMobile}
              target="_blank"
              text={'Découvrir vos aides à la réno'}
              textMobile={'Découvrir vos aides à la réno'}
            />
          </ModuleWrapper>
        ) : (
          <CalculatorWidget>{children}</CalculatorWidget>
        ),
    [isMobile],
  )

  return (
    <Wrapper type={type}>
      <DeuxColonnes $isMobile={isMobile}>
        <div>
          <div>
            <EnergieTable
              {...{
                title: 'Actuellement :',
                pourcentages: pourcentagesAvantReno,
                energies,
                energiesUtilisees,
                showTable,
                setShowTable,
              }}
            />
          </div>
          <div>
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
              {...{
                title: 'Après rénovation :',
                pourcentages: pourcentagesApresReno,
                energies,
                energiesUtilisees: energiesUtiliseesApresReno,
                editable: true,
                showTable,
                setShowTable,
              }}
            />
          </div>
          <div>
            <TargetDPETabs
              {...{
                setSearchParams,
                situation,
                noSuccess: true,
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
  margin-bottom: 2rem;
  display: flex;
  ${(p) => p.$isMobile && 'flex-direction: column;'}
  position: relative;
  > div:first-of-type {
    ${(p) =>
      p.$isMobile
        ? `
          border-bottom: 1px solid black;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        `
        : `
          border-right: 1px solid black;
          padding-right: 1rem;
          margin-right: 1rem;
        `}
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-grow: 1;
    width: 100%;
  }
`
