import { Dot } from '@/app/module/AmpleurQuestions'
import { useEffect, useState } from 'react'
import {
  Explication,
  getQuestions,
  MontantPrimeTravaux,
  Priorité,
} from './DPETravauxModule'
import { Card, CTA, MiseEnAvant } from '@/components/UI'
import GesteQuestion from '@/components/GesteQuestion'
import React from 'react'

export const getAssociationTravauxDpe = (dpe) => ({
  'gestes . isolation . vitres': 'qualite_isolation_menuiseries',
  'gestes . isolation . murs': 'qualite_isolation_murs',
  'gestes . isolation . plancher bas': 'qualite_isolation_plancher_bas',
  'gestes . isolation . toitures terrasses':
    'qualite_isolation_plancher_haut_toit_terrase',
  'gestes . isolation . rampants': dpe[
    'qualite_isolation_plancher_haut_comble_perdu'
  ]
    ? 'qualite_isolation_plancher_haut_comble_perdu'
    : 'qualite_isolation_plancher_haut_comble_amenage',
})

export function DPETravauxIsolation({
  dpe,
  xml,
  rules,
  engine,
  situation,
  setSearchParams,
}) {
  const STORAGE_KEY = 'visibleDivsDPE'
  const QUESTIONS_KEY = 'questionsByIndexDPE'
  const [visibleDivs, setVisibleDivs] = useState(() => {
    if (typeof window === 'undefined') return {}
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  })
  const [questionsByIndex, setQuestionsByIndex] = useState(() => {
    if (typeof window === 'undefined') return {}
    const saved = sessionStorage.getItem(QUESTIONS_KEY)
    return saved ? JSON.parse(saved) : {}
  })
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(visibleDivs))
  }, [visibleDivs])
  useEffect(() => {
    sessionStorage.setItem(QUESTIONS_KEY, JSON.stringify(questionsByIndex))
  }, [questionsByIndex])

  const toggle = (index) => {
    setVisibleDivs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleIsolationClick = (index, rule) => {
    const newQuestions = getQuestions(rule, situation, engine)
    console.log('newQuestions', newQuestions)
    setQuestionsByIndex((prev) => ({
      ...prev,
      [index]: newQuestions,
    }))
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Travaux</th>
            <th>Priorité</th>
            <th>Aides</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(getAssociationTravauxDpe(dpe)).map((e, i) => {
            return (
              dpe[e[1]] && (
                <React.Fragment key={i}>
                  <tr>
                    <td
                      css={`
                        display: flex;
                        align-items: center;
                      `}
                    >
                      <Dot />
                      {rules[e[0]].titre}
                      <Explication
                        geste={e[0]}
                        dpe={dpe}
                        xml={xml}
                        index={i}
                        type="tooltip"
                      />
                    </td>
                    <td
                      css={`
                        text-align: center;
                      `}
                    >
                      <Priorité valeur={dpe[e[1]]} />
                    </td>
                    <td
                      css={`
                        div {
                          margin: auto;
                        }
                      `}
                    >
                      <CTA
                        $fontSize="normal"
                        $importance="secondary"
                        className="estimer"
                        onClick={() => {
                          toggle(i)
                          handleIsolationClick(i, e[0])
                        }}
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
                          {questionsByIndex[i]?.map((question, index) => (
                            <GesteQuestion
                              key={i + '' + index}
                              {...{
                                rules,
                                question,
                                engine,
                                situation,
                                setSearchParams,
                              }}
                            />
                          ))}
                          <MontantPrimeTravaux
                            {...{
                              questions: questionsByIndex[i],
                              engine,
                              rule: e[0],
                              situation,
                            }}
                          />
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
    </>
  )
}
