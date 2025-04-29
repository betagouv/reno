'use client'
import Image from 'next/image'
import data from '@/components/dpe/DPE.yaml'
import iconArgent from '@/public/icon-argent.png'
import listeEnergies from '@/app/règles/dpe/energies.publicodes'
import { formatNumberWithSpaces } from '../utils'
import { formatNumber } from '../RevenuInput'
import DPEQuickSwitch from './DPEQuickSwitch'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import Select from '../Select'
import editIcon from '@/public/crayon.svg'
import informationIcon from '@/public/information.svg'
import CalculatorWidget from '../CalculatorWidget'
import {
  encodeDottedName,
  encodeSituation,
  getSituation,
} from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSetSearchParams from '../useSetSearchParams'
import DPELabel, { conversionLettreIndex } from './DPELabel'
import { fetchDPE } from './DPEPage'

const prixAbonnementElectricite = 160

export default function DPEFactureModule({ numDpe }) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 400,
  )
  const setSearchParams = useSetSearchParams()
  const energies = listeEnergies['énergies . type']['une possibilité parmi'][
    'possibilités'
  ].map((e) => listeEnergies['énergie . ' + e])
  const [dpe, setDpe] = useState()
  const [pourcentagesAvantReno, setPourcentagesAvantReno] = useState([])
  const [pourcentagesApresReno, setPourcentagesApresReno] = useState([])
  const [energiesUtilisees, setEnergiesUtilisees] = useState([])
  const [energiesUtiliseesApresReno, setEnergiesUtiliseesApresReno] = useState(
    [],
  )
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
    setMontantFactureActuelle(
      noDetail
        ? dpe['cout_total_5_usages']
        : Math.round(
            energiesUtilisees.reduce(
              (total, energie, i) =>
                total +
                energie['prix moyen'] *
                  (dpe[`conso_5_usages_ef_energie_n${i + 1}`] || 0),
              0,
            ),
          ),
    )
    setSearchParams(
      encodeSituation({
        'DPE . actuel': conversionLettreIndex.indexOf(dpe['etiquette_dpe']),
        'projet . DPE visé':
          conversionLettreIndex.indexOf(dpe['etiquette_dpe']) - 1,
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
      ),
    )
  }, [pourcentagesApresReno, energiesUtiliseesApresReno, situation])

  const EnergieTable = ({
    title,
    pourcentages,
    energies,
    energiesUtilisees,
    editable,
  }) => (
    <>
      <div
        css={`
          font-weight: bold;
        `}
      >
        {title}
      </div>
      <table
        css={`
          margin-left: 1rem;
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
                            ? energies.find((energie) => energie.titre === e)
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
    </>
  )

  const MontantFacture = ({ montant, type, isMobile }) => (
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
        {type == 'actuel'
          ? 'Facture estimée'
          : 'Facture estimée après rénovation'}
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
          width: ${isMobile ? '100%' : '80%'};
        `}
      >
        {montant > 0 ? (
          <span>
            entre <strong>{formatNumber(0.9 * montant)} €</strong> et{' '}
            <strong>{formatNumber(1.1 * montant)} €</strong>
            <span
              title={
                type == 'actuel'
                  ? 'Ce montant est estimé sur la base des informations fournies dans le DPE, réajusté sur les prix actuels moyens des énergies'
                  : "Ce montant n'est qu'une estimation"
              }
              css={`
                margin-left: 0.5rem;
                :hover {
                  cursor: pointer;
                }
              `}
            >
              <Image src={informationIcon} width="20" alt="Icône information" />
            </span>
          </span>
        ) : (
          <small>
            Veuillez renseigner les valeurs de la calculatrice pour connaître le
            montant
          </small>
        )}
      </div>
    </div>
  )

  return (
    <CalculatorWidget>
      <div
        css={`
          display: flex;
          ${isMobile && 'flex-direction: column;'}
          > div {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: ${isMobile ? '100%' : '50%'};
          }
        `}
      >
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
      </div>
    </CalculatorWidget>
  )
}
