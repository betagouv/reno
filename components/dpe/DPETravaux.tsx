'use client'
import Image from 'next/image'
import informationIcon from '@/public/information.svg'
import Publicodes, { formatValue } from 'publicodes'
import rules from '@/app/règles/rules'
import CalculatorWidget from '../CalculatorWidget'
import {
  getAnsweredQuestions,
  getSituation,
} from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CTA, PrimeStyle } from '../UI'
import getNextQuestions from '../publicodes/getNextQuestions'
import GesteQuestion from '../GesteQuestion'
import { AvanceTMO } from '../mprg/BlocAideMPR'
import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

export default function DPETravaux({ dpe, setSearchParams, isMobile }) {
  const [visibleDivs, setVisibleDivs] = useState({})
  const [questions, setQuestions] = useState([])
  const [xml, setXml] = useState()
  const [isEligible, setIsEligible] = useState(false)
  const associationTravauxDpe = {
    'gestes . isolation . vitres': 'qualite_isolation_menuiseries',
    'gestes . isolation . murs extérieurs': 'qualite_isolation_murs',
    'gestes . isolation . murs intérieurs': 'qualite_isolation_murs',
    'gestes . isolation . plancher bas': 'qualite_isolation_plancher_bas',
    'gestes . isolation . toitures terrasses':
      'qualite_isolation_plancher_haut_toit_terrase',
    'gestes . isolation . rampants':
      'qualite_isolation_plancher_haut_comble_perdu',
    //TODO PB ici cf message coloration syntaxique
    'gestes . isolation . rampants':
      'qualite_isolation_plancher_haut_comble_amenage',
    'gestes . ventilation . double flux': 'test',
  }
  async function isEligibleReseauChaleur(dpe) {
    const [lat, lon] = dpe['_geopoint'].split(',')
    const response = await fetch(`/api/fcu?lat=${lat}&lon=${lon}`)
    if (!response.ok) return false

    const json = await response.json()
    return json.isEligible
  }

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

    // Les règles métiers:
    // TODO: Est-ce possible de raccorder à un réseau de chaleur, FCU?
    // On veut absolument remplacer les chauffages au fioul
    let conseil = ''
    let priorite = 1
    let gestes = []

    // Test raccordement réseau chaleur, via FCU
    isEligibleReseauChaleur(dpe).then((eligibility) => {
      if (eligibility) {
        conseil = 'Votre domicile peut se raccorder à un réseau de chaleur'
        gestes.push('gestes . chauffage . raccordement réseau . chaleur')
      }
    })

    fetchDPE()
  }, [dpe])

  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  const handleEstimateClick = (index, rule) => {
    // Le setSituation est nécessaire pour que les nextQuestions soient à jour
    const questions = getNextQuestions(
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
    //questions.unshift(...Object.keys(situation))
    // On affiche les questions répondues, mais pas celles validées (sinon elles s'affichent lors du parcours par geste)
    const questionsAnswered = Object.keys(situation).filter(
      (q) =>
        questions.includes(q) &&
        !getAnsweredQuestions(searchParams, rules).includes(q),
    )
    console.log('questionsAnswered', questionsAnswered)
    console.log('questions', questions)
    setIsEligible(formatValue(engine.evaluate(rule + ' . montant')))
    setQuestions(questionsAnswered)
    setVisibleDivs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  return (
    <CalculatorWidget>
      <table
        css={`
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
        `}
      >
        <thead>
          <tr>
            <th>Travaux</th>
            <th>Priorité</th>
            <th>Explication</th>
            <th>Aides</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(associationTravauxDpe).map((e, i) => {
            return (
              dpe[e[1]] && (
                <React.Fragment key={i}>
                  <tr>
                    <td>{rules[e[0]].titre}</td>
                    <td
                      css={`
                        text-align: center;
                      `}
                    >
                      <Priorité valeur={dpe[e[1]]} />
                    </td>
                    <td
                      css={`
                        text-align: center;
                      `}
                    >
                      <Explication geste={e[0]} dpe={dpe} xml={xml} index={i} />
                    </td>
                    <td>
                      <CTA
                        $fontSize="normal"
                        $importance="secondary"
                        className="estimer"
                        onClick={() => handleEstimateClick(i, e[0])}
                      >
                        <span>{visibleDivs[i] ? 'Fermer' : 'Estimer'}</span>
                      </CTA>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <div
                        className={`slide-down ${visibleDivs[i] ? 'active' : ''}`}
                      >
                        <Card>
                          {questions.map((question, index) => (
                            <GesteQuestion
                              key={index}
                              {...{
                                rules,
                                question,
                                engine,
                                situation,
                                setSearchParams,
                                dot: true,
                              }}
                            />
                          ))}
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
                                  questions.every(
                                    (question) => question in situation,
                                  )
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
                                    questions.every(
                                      (question) => question in situation,
                                    )
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
                          <AvanceTMO {...{ engine, situation }} />
                        </Card>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              )
            )
          })}
        </tbody>
      </table>
    </CalculatorWidget>
  )
}

export function Priorité({ valeur }) {
  const star = {
    insuffisante: '⭐⭐⭐',
    moyenne: '⭐⭐',
    bonne: '⭐',
    'très bonne': '⭐',
  }
  return <span>{star[valeur]}</span>
}
export function Explication({ geste, dpe, xml, index }) {
  if (!dpe) return

  function pourcentageDeperdition(pourcentage) {
    console.log('dpe', dpe)
    return (
      ((dpe[pourcentage] / dpe['deperditions_enveloppe']) * 100).toFixed(0) +
      '%'
    )
  }

  let explication = ''
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
      <span data-tooltip-id={index.toString()}>
        <Image src={informationIcon} width="25" alt="Icône information" />
      </span>
      <ReactTooltip id={index.toString()} place="top">
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
