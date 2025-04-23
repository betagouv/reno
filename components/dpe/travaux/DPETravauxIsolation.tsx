import { Dot } from '@/app/module/AmpleurQuestions'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { getAnsweredQuestions } from '@/components/publicodes/situationUtils'
import { formatValue } from 'publicodes'
import { useState } from 'react'
import {
  Explication,
  getQuestions,
  MontantPrimeTravaux,
  Priorité,
} from './DPETravauxModule'
import { Card, CTA, MiseEnAvant, PrimeStyle } from '@/components/UI'
import GesteQuestion from '@/components/GesteQuestion'
import React from 'react'
import { AvanceTMO } from '@/components/mprg/BlocAideMPR'

export function DPETravauxIsolation({
  dpe,
  xml,
  rules,
  engine,
  situation,
  setSearchParams,
}) {
  const [questions, setQuestions] = useState([])
  const [visibleDivs, setVisibleDivs] = useState({})
  const associationTravauxDpe = {
    'gestes . isolation . vitres': 'qualite_isolation_menuiseries',
    'gestes . isolation . murs extérieurs': 'qualite_isolation_murs',
    'gestes . isolation . murs intérieurs': 'qualite_isolation_murs',
    'gestes . isolation . plancher bas': 'qualite_isolation_plancher_bas',
    'gestes . isolation . toitures terrasses':
      'qualite_isolation_plancher_haut_toit_terrase',
    'gestes . isolation . rampants': dpe[
      'qualite_isolation_plancher_haut_comble_perdu'
    ]
      ? 'qualite_isolation_plancher_haut_comble_perdu'
      : 'qualite_isolation_plancher_haut_comble_amenage',
  }

  const handleIsolationClick = (rule) => {
    const questions = getQuestions(rule, situation, engine)
    setQuestions(questions)
  }
  return (
    <>
      <MiseEnAvant>
        <Explication geste="isolation" dpe={dpe} xml={xml} />
      </MiseEnAvant>
      <table>
        <thead>
          <tr>
            <th>Travaux</th>
            <th>Priorité</th>
            <th>Aides</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(associationTravauxDpe).map((e, i) => {
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
                          setVisibleDivs((prevState) => ({
                            ...prevState,
                            [i]: !prevState[i],
                          }))
                          handleIsolationClick(e[0])
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
                          {questions.map((question, index) => (
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
                              questions,
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
