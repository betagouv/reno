'use client'
import Image from 'next/image'
import informationIcon from '@/public/information.svg'
import Publicodes, { formatValue } from 'publicodes'
import rules from '@/app/règles/rules'
import CalculatorWidget from '../CalculatorWidget'
import { getSituation } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import styled from 'styled-components'
import { DPETravauxIsolation } from './travaux/DPETravauxIsolation'
import { DPETravauxChauffage } from './travaux/DPETravauxChauffage'
import { PrimeStyle } from '../UI'

export default function DPETravaux({ dpe, setSearchParams, isMobile }) {
  const [visibleWork, setVisibleWork] = useState({})
  const [xml, setXml] = useState()

  useEffect(() => {
    if (!dpe) return
    async function fetchDPE() {
      try {
        const response = await fetch(`/api/dpe?dpeNumber=${dpe['numero_dpe']}`)
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

  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  const getPriorite = (type) => {
    if (type == 'chauffage') return 'insuffisante'
    if (type == 'isolation') {
      return 'insuffisante'
      return Object.entries(associationTravauxDpe).find(
        (e, i) => dpe[e[1]] == 'insuffisante',
      )
        ? 'insuffisante'
        : Object.entries(associationTravauxDpe).find(
              (e, i) => dpe[e[1]] == 'moyenne',
            )
          ? 'moyenne'
          : 'bonne'
    }
  }

  return (
    <CalculatorWidget>
      <Table>
        {/* <thead>
          <tr>
            <th>Travaux</th>
            <th>Priorité</th>
            <th>Explication</th>
            <th>Aides</th>
          </tr>
        </thead> */}
        <tbody>
          <tr>
            <td>Isoler mon logement</td>
            <td>
              <Priorité valeur={getPriorite('isolation')} />
            </td>
            <td>
              <Explication geste="isolation" dpe={dpe} xml={xml} />
            </td>
            <td>
              <span
                onClick={() =>
                  setVisibleWork((prevState) => ({
                    ...prevState,
                    ['isolation']: !prevState['isolation'],
                  }))
                }
                title="Voir le détail"
              >
                🔎
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div
                className={`slide-down ${visibleWork['isolation'] ? 'active' : ''}`}
              >
                <DPETravauxIsolation
                  {...{
                    dpe,
                    xml,
                    rules,
                    engine,
                    situation,
                    setSearchParams,
                  }}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>Changer mon système de chauffage</td>
            <td>
              <Priorité valeur={getPriorite('chauffage')} />
            </td>
            <td>
              <Explication geste="chauffage" dpe={dpe} xml={xml} />
            </td>
            <td>
              <span
                onClick={() =>
                  setVisibleWork((prevState) => ({
                    ...prevState,
                    ['chauffage']: !prevState['chauffage'],
                  }))
                }
                title="Voir le détail"
              >
                🔎
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div
                className={`slide-down ${visibleWork['chauffage'] ? 'active' : ''}`}
              >
                <DPETravauxChauffage
                  {...{
                    dpe,
                    xml,
                    rules,
                    engine,
                    situation,
                    setSearchParams,
                  }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </CalculatorWidget>
  )
}

export function Priorité({ valeur }) {
  const niveau = {
    1: '⭐',
    2: '⭐⭐',
    3: '⭐⭐⭐',
  }
  const star = {
    insuffisante: '⭐⭐⭐',
    moyenne: '⭐⭐',
    bonne: '⭐',
    'très bonne': '⭐',
  }
  return <span>{star[valeur] ? star[valeur] : niveau[valeur]}</span>
}
export function Explication({ geste, dpe, xml, index }) {
  if (!dpe) return

  function pourcentageDeperdition(pourcentage) {
    return (
      ((dpe[pourcentage] / dpe['deperditions_enveloppe']) * 100).toFixed(0) +
      '%'
    )
  }

  let explication = ''
  if (geste == 'chauffage') {
    explication =
      "Le système de chauffage est la première source de consommation énergétique de votre logement. Pour réduire ces dépenses, il est tout d'abord nécessaire de bien isoler votre logement ensuite, de changer votre système de chauffage."
  }
  if (geste == 'isolation') {
    explication =
      "Un logement mal isolé génère des pertes conséquentes de chaleur en hiver et de fraîcheur en été par le toit, les murs, les portes, les fenêtres et le sol. Grâce à des travaux d'isolation, vous diminuez vos factures d'énergie et améliorez votre confort tout au long de l'année."
  }
  if (geste == 'gestes . isolation . vitres') {
    explication = `En moyenne, 10 à 15% des déperditions d'énergie se font par les fenêtres.<br /> Dans ce bien, la part de déperdition dûe au fenêtre est de <strong>${pourcentageDeperdition('deperditions_baies_vitrees')}</strong>.<br /><br />`
    if (xml?.baieVitree?.length) {
      explication +=
        'Voici les informations concernant les menuiseries de ce bien:'
      explication += '<ul>'
      xml?.baieVitree?.map(
        (baieVitree) => (explication += `<li>${baieVitree}</li>`),
      )
      explication += '</ul>'
    }
  }
  if (geste == 'ventilation . double flux') {
    explication = `
      En moyenne, 20 à 25% des déperditions d'énergie proviennent de la ventilation et des ponts thermiques.<br /> 
      Dans ce bien, la part de déperdition dûe à la ventilation est de <strong>${pourcentageDeperdition('deperditions_renouvellement_air')}</strong>.`
  }
  if (
    [
      'gestes . isolation . toitures terrasses',
      'gestes . isolation . rampants',
    ].includes(geste)
  ) {
    explication = `
      En moyenne, 20 à 25% des déperditions d'énergie proviennent de la toiture.<br /> 
      Dans ce bien, la part de déperdition par la toiture est de <strong>${pourcentageDeperdition('deperditions_planchers_hauts')}</strong>.<br /><br />`
    if (xml?.plafond?.length) {
      explication += 'Voici les informations concernant la toiture de ce bien:'
      explication += '<ul>'
      xml?.plafond?.map((plafond) => (explication += `<li>${plafond}</li>`))
      explication += '</ul>'
    }
  }
  if (
    [
      'gestes . isolation . murs extérieurs',
      'gestes . isolation . murs intérieurs',
    ].includes(geste)
  ) {
    explication = `
      En moyenne, 20 à 25% des déperditions d'énergie proviennent des murs.<br />
      Dans ce bien, la part de déperdition par les murs est de <strong>${pourcentageDeperdition('deperditions_murs')}</strong>.<br /><br />`
    if (xml?.descriptionMurs?.length) {
      explication += 'Voici les informations concernant les murs de ce bien:'
      explication += '<ul>'
      xml?.descriptionMurs?.map((mur) => (explication += `<li>${mur}</li>`))
      explication += '</ul>'
    }
  }
  if (geste == 'gestes . isolation . plancher bas') {
    explication = `
      En moyenne, 7 à 10% des déperditions d'énergie proviennent du plancher.<br />
      Dans ce bien, la part de déperdition par le plancher est de <strong>${pourcentageDeperdition('deperditions_planchers_bas')}</strong>.<br /><br />`
    if (xml?.plancher?.length) {
      explication += 'Voici les informations concernant le plancher de ce bien:'
      explication += '<ul>'
      xml?.plancher?.map((plancher) => (explication += `<li>${plancher}</li>`))
      explication += '</ul>'
    }
  }
  return (
    <>
      <span data-tooltip-id={index ? index.toString() : geste}>
        <Image src={informationIcon} width="25" alt="Icône information" />
      </span>
      <ReactTooltip id={index ? index.toString() : geste} place="top">
        <div
          style={{
            maxWidth: 500,
            textAlign: 'left',
          }}
          dangerouslySetInnerHTML={{ __html: explication }}
        ></div>
      </ReactTooltip>
    </>
  )
}
export function MontantPrimeTravaux({ questions, evaluation, situation }) {
  console.log('evaluation', evaluation)
  const isEligible = formatValue(evaluation)
  return (
    <div
      css={`
        justify-content: end;
        display: flex;
      `}
    >
      <PrimeStyle
        css={`
          padding: 0.75rem;
        `}
        $inactive={
          !(
            Array.isArray(questions) &&
            questions.every((question) => question in situation)
          )
        }
      >
        {isEligible !== 'Non applicable' ? (
          <>
            Prime de{' '}
            <strong
              css={`
                font-size: 1.5rem;
              `}
            >
              {Array.isArray(questions) &&
              questions.every((question) => question in situation)
                ? isEligible
                : '...'}
            </strong>
          </>
        ) : (
          <strong
            css={`
              font-size: 1.25rem;
            `}
          >
            Non Éligible
          </strong>
        )}
      </PrimeStyle>
    </div>
  )
}

const Table = styled.table`
  width: 100%;

  .estimer:hover {
    background: var(--color);
    color: white;
  }
  .slide-down {
    overflow: hidden;
    max-height: 0;
    transition: max-height 1s ease-out;
  }

  .slide-down.active {
    max-height: fit-content;
  }
  tr:hover {
    cursor: pointer;
  }
  tr td:not(:first-of-type) {
    text-align: center;
  }
  img {
    width: 1rem;
    height: auto;
    margin: 0 1rem 0 0;
  }
  table {
    width: 100%;
  }
`
