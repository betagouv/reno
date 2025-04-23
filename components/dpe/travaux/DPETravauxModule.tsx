'use client'
import Image from 'next/image'
import informationIcon from '@/public/information.svg'
import Publicodes, { formatValue } from 'publicodes'
import rules from '@/app/règles/rules'
import CalculatorWidget from '../../CalculatorWidget'
import { getSituation } from '../../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import styled from 'styled-components'
import { DPETravauxIsolation } from './DPETravauxIsolation'
import { DPETravauxChauffage } from './DPETravauxChauffage'
import { PrimeStyle } from '../../UI'
import getNextQuestions from '../../publicodes/getNextQuestions'
import simulationConfig from '@/app/simulation/simulationConfigMPR.yaml'
import { AvanceTMO } from '../../mprg/BlocAideMPR'
import { DPETravauxAmpleur } from './DPETravauxAmpleur'

export default function DPETravauxModule({ dpe, setSearchParams }) {
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
  const situation = {
    ...getSituation(searchParams, rules),
    'vous . propriétaire . statut': 'propriétaire',
  }

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
    if (type == 'ampleur') {
      if (['F', 'G'].includes(dpe['etiquette_dpe'])) {
        return 'insuffisante'
      }
      if (['D', 'E'].includes(dpe['etiquette_dpe'])) {
        return 'moyenne'
      }
      return 'bonne'
    }
  }

  const displayBloc = (type) => {
    setVisibleWork((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }))
  }

  return (
    <CalculatorWidget>
      <Accordion>
        <section>
          <h3
            onClick={() => displayBloc('isolation')}
            className={visibleWork['isolation'] ? 'active' : ''}
          >
            Isoler mon logement
            <span>
              <Priorité valeur={getPriorite('isolation')} />
              <span title="Voir le détail">🔎</span>
            </span>
          </h3>
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
        </section>
        <section>
          <h3
            onClick={() => displayBloc('chauffage')}
            className={visibleWork['chauffage'] ? 'active' : ''}
          >
            <span>Changer mon système de chauffage</span>
            <span>
              <Priorité valeur={getPriorite('chauffage')} />
              <span title="Voir le détail">🔎</span>
            </span>
          </h3>
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
        </section>
        <section>
          <h3
            onClick={() => displayBloc('ampleur')}
            className={visibleWork['ampleur'] ? 'active' : ''}
          >
            <span>Rénovation globale</span>
            <span>
              <Priorité valeur={getPriorite('ampleur')} />
              <span title="Voir le détail">🔎</span>
            </span>
          </h3>
          <div
            className={`slide-down ${visibleWork['ampleur'] ? 'active' : ''}`}
          >
            <DPETravauxAmpleur
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
        </section>
      </Accordion>
    </CalculatorWidget>
  )
}
export const getQuestions = (rule, situation, engine) => {
  // Le setSituation est nécessaire pour que les nextQuestions soient à jour
  let questions = getNextQuestions(
    engine
      .setSituation({
        ...situation,
        'MPR . non accompagnée . éligible': 'oui',
        [rule]: 'oui',
      })
      .evaluate(rule + ' . montant'),
    [],
    simulationConfig,
    rules,
  )

  // On ajoute les questions déja répondues qui ne sont pas renvoyées par le getNextQuestions
  // et qui sont utiles pour évaluer le montant du geste
  const usefulQuestionsForGeste = getNextQuestions(
    engine
      .setSituation({
        'MPR . non accompagnée . éligible': 'oui',
        [rule]: 'oui',
      })
      .evaluate(rule + ' . montant'),
    [],
    simulationConfig,
    rules,
  )
  // Il y a certaines questions que l'on ne souhaite pas voir à des fins ergonomiques
  // Par exemple, on est sûr de l'adresse du logement et de sa période de construction, on ne veut pas surcharger l'interface avec ça
  const unwantedQuestion = [
    'logement . période de construction',
    'logement . commune',
    'logement . surface',
    'DPE . actuel',
    'logement . type',
    'vous . propriétaire . statut', // On part du principe qu'on s'adresse uniquement à des (futurs)proprios
  ]
  questions.unshift(
    ...Object.keys(situation).filter((q) =>
      usefulQuestionsForGeste.includes(q),
    ),
  )
  return questions.filter((q) => !unwantedQuestion.includes(q))
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
export function Explication({ geste, dpe, xml, index, type }) {
  if (!dpe) return

  function pourcentageDeperdition(pourcentage) {
    return (
      ((dpe[pourcentage] / dpe['deperditions_enveloppe']) * 100).toFixed(0) +
      '%'
    )
  }

  let explication = ''
  if (geste == 'ampleur') {
    explication =
      "En entreprenant plusieurs travaux à la fois, vous bénéficierez d'aides plus avantageuses et serez mieux accompagné dans le suivi de votre projet"
  }
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
  return type == 'tooltip' ? (
    <>
      <span
        css={`
          display: flex;
          margin-left: 0.5rem;
        `}
        data-tooltip-id={index ? index.toString() : geste}
      >
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
  ) : (
    <div dangerouslySetInnerHTML={{ __html: explication }} />
  )
}
export function MontantPrimeTravaux({ questions, engine, rule, situation }) {
  const isEligible = formatValue(
    engine.setSituation(situation).evaluate(rule + ' . montant'),
  )
  return (
    <>
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
      <div
        css={`
          margin-top: 0.5rem;
        `}
      >
        <AvanceTMO {...{ engine, situation }} />
      </div>
    </>
  )
}

const Accordion = styled.div`
  display: block !important;
  width: 100%;
  section > h3 {
    margin: 0;
    font-size: 100%;
    display: flex;
    justify-content: space-between;
    color: var(--color);
    font-weight: normal;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid grey;
    > span:last-of-type {
      display: flex;
      width: 30%;
      justify-content: space-between;
    }
    &:hover {
      cursor: pointer;
      background: white;
    }
    &.active {
      border-bottom: 0px;
      background: white;
    }
  }
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
    background: white;
  }
  section > .slide-down.active {
    padding: 1rem;
  }
  table {
    width: 100%;
    td {
      border: none;
    }
  }
  tr td:first-of-type > img {
    width: 1rem;
    height: auto;
    margin: 0 0.5rem;
  }
  span {
    cursor: pointer;
  }
`
