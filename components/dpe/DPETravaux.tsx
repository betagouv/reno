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

export default function DPETravaux({ dpe, setSearchParams, isMobile }) {
  const [visibleDivs, setVisibleDivs] = useState({})
  const [questions, setQuestions] = useState([])
  const [isEligible, setIsEligible] = useState(false)
  const associationTravauxDpe = {
    'gestes . isolation . vitres': 'Qualité_isolation_menuiseries',
    'gestes . isolation . murs extérieurs': 'Qualité_isolation_murs',
    'gestes . isolation . murs intérieurs': 'Qualité_isolation_murs',
    'gestes . isolation . plancher bas': 'Qualité_isolation_plancher_bas',
    'gestes . isolation . toitures terrasses':
      'Qualité_isolation_plancher_haut_toit_terrase',
    'gestes . isolation . rampants':
      'Qualité_isolation_plancher_haut_comble_perdu',
    //TODO PB ici cf message coloration syntaxique
    'gestes . isolation . rampants':
      'Qualité_isolation_plancher_haut_comble_aménagé',
  }
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
    setQuestions(questions)
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
                      <span title="XXX">
                        <Image
                          src={informationIcon}
                          width="25"
                          alt="Icône information"
                        />
                      </span>
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
