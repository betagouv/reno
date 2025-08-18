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
import {
  DPETravauxIsolation,
  getAssociationTravauxDpe,
} from './DPETravauxIsolation'
import { DPETravauxChauffage } from './DPETravauxChauffage'
import getNextQuestions from '../../publicodes/getNextQuestions'
import { AvanceTMO } from '../../mprg/BlocAideMPR'
import { DPETravauxAmpleur } from './DPETravauxAmpleur'
import useDpe from '../useDpe'
import useSetSearchParams from '@/components/useSetSearchParams'
import { ModuleWrapper } from '@/app/module/ModuleWrapper'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Button from '@codegouvfr/react-dsfr/Button'
import useIsMobile from '@/components/useIsMobile'

export default function DPETravauxModule({ type, numDpe }) {
  const dpe = useDpe(numDpe)
  const [showMPRA, setShowMPRA] = useState(false)
  const isMobile = useIsMobile(400)
  const setSearchParams = useSetSearchParams()
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
    if (type == 'chauffage') {
      const chauffage = dpe['type_generateur_chauffage_principal']
      // Si le chauffage à moins de 10 ans
      // S'il s'agit d'un réseau de chaleur
      // S'il a le label flamme verte
      if (
        (Number.isInteger(chauffage.slice(-4)) &&
          chauffage.slice(-4) >= new Date().getFullYear() - 10) ||
        chauffage.includes('réseau de chaleur') ||
        chauffage.includes('avec label flamme verte')
      )
        return 'bonne'
      // S'il s'agit d'un chauffage au fioul
      // Si le chauffage à plus de 20 ans
      // S'il s'agit d'une chaudière électrique
      // S'il n'a pas de label flamme verte
      // S'il utilise de l'énergie fossile
      if (
        chauffage.includes('fioul') ||
        (Number.isInteger(chauffage.slice(-4)) &&
          chauffage.slice(-4) < new Date().getFullYear() - 20) ||
        chauffage == 'Chaudière électrique' ||
        chauffage.includes('sans label flamme verte') ||
        chauffage.includes('Convecteur électrique NFC, NF** et NF***') ||
        chauffage.includes('sans label flamme verte') ||
        chauffage.includes('energies fossiles')
      )
        return 'insuffisante'
      return 'moyenne'
    }
    if (type == 'isolation') {
      // On prend la pire notation des "sous"-travaux d'isolation
      const travauxIsolation = Object.entries(getAssociationTravauxDpe(dpe))
      return travauxIsolation.find((e) => dpe[e[1]] == 'insuffisante')
        ? 'insuffisante'
        : travauxIsolation.find((e) => dpe[e[1]] == 'moyenne')
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

  const Wrapper = ({ type, children }) =>
    type === 'module' ? (
      <ModuleWrapper isMobile={isMobile} title="Quels travaux privilégier ?">
        {children}
      </ModuleWrapper>
    ) : (
      <CalculatorWidget>{children}</CalculatorWidget>
    )

  return (
    <Wrapper type={type}>
      {dpe && (
        <Accordion>
          <section>
            <h3>
              <span>
                Isoler mon logement
                <Explication
                  geste="isolation"
                  dpe={dpe}
                  xml={xml}
                  type="tooltip"
                />
              </span>
              <span>
                <Priorité valeur={getPriorite('isolation')} />
              </span>
            </h3>
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
          </section>
          <section>
            <h3>
              <span>
                Changer mon système de chauffage
                <Explication
                  geste="chauffage"
                  dpe={dpe}
                  xml={xml}
                  type="tooltip"
                />
              </span>
              <span>
                <Priorité valeur={getPriorite('chauffage')} />
              </span>
            </h3>
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
          </section>
          <section>
            <h3>
              <span>
                Rénovation globale
                <Explication
                  geste="ampleur"
                  dpe={dpe}
                  xml={xml}
                  type="tooltip"
                />
              </span>
              <span>
                <Priorité valeur={getPriorite('ampleur')} />
              </span>
              <Button
                priority="secondary"
                className="estimer"
                onClick={() => setShowMPRA((prev) => !prev)}
              >
                {showMPRA ? 'Fermer' : 'Estimer'}
              </Button>
            </h3>
            <div
              css={`
                display: ${showMPRA ? 'block' : 'none'};
              `}
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
      )}
    </Wrapper>
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
    [],
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
  // On filtre également les questions qui n'ont pas de libellé
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
      "Le système de chauffage est la première source de consommation énergétique d'un logement. Il est d'abord nécessaire de bien isoler le logement avant de changer le système de chauffage."
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
        <Badge
          noIcon
          severity={
            Array.isArray(questions) &&
            questions.every((question) => question in situation)
              ? 'success'
              : 'default'
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
        </Badge>
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
  section {
    border: 1px solid var(--color);
    padding: 0.5rem;
    margin-bottom: 10px;
    > h3 {
      margin: 0;
      font-size: 100%;
      display: flex;
      justify-content: space-between;
      > span:first-of-type {
        display: flex;
        align-items: center;
        color: var(--color);
        font-weight: bold;
      }
      > span:last-of-type {
        display: flex;
        width: 30%;
        justify-content: space-between;
      }
      &.active {
        border-bottom: 0px;
        background: white;
      }
    }
  }
  .estimer {
    font-weight: normal;
    &:hover {
      background: var(--color);
      color: white;
    }
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
