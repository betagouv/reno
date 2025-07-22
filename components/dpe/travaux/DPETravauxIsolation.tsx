import { Dot } from '@/app/module/AmpleurQuestions'
import { useMemo, useState } from 'react'
import {
  Explication,
  getQuestions,
  MontantPrimeTravaux,
  Priorité,
} from './DPETravauxModule'
import { Card, CTA } from '@/components/UI'
import GesteQuestion from '@/components/GesteQuestion'
import React from 'react'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import Button from '@codegouvfr/react-dsfr/Button'

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
  const questionsByRule = useMemo(() => {
    const entries = Object.entries(getAssociationTravauxDpe(dpe))
    const qbr = {}
    for (const [rule] of entries) {
      if (situation[rule] === 'oui') {
        qbr[rule] = getQuestions(rule, situation, engine)
      }
    }
    return qbr
  }, [situation, dpe, engine])

  const handleIsolationClick = (rule) => {
    setSearchParams(
      encodeSituation(
        {
          ...situation,
          [rule]: situation[rule] === 'oui' ? 'non' : 'oui',
        },
        false,
      ),
    )
  }
  return (
    <div>
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
                    <td>
                      <Button
                        priority="secondary"
                        className="estimer"
                        onClick={() => {
                          handleIsolationClick(e[0])
                        }}
                      >
                        {situation[e[0]] === 'oui' ? 'Fermer' : 'Estimer'}
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <div
                        className={`slide-down ${situation[e[0]] === 'oui' ? 'active' : ''}`}
                      >
                        <Card>
                          {questionsByRule[e[0]]?.map((question, index) => (
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
                              questions: questionsByRule[e[0]],
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
    </div>
  )
}
