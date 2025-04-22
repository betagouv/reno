import { Dot } from '@/app/module/AmpleurQuestions'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { getAnsweredQuestions } from '@/components/publicodes/situationUtils'
import { formatValue } from 'publicodes'
import { useState } from 'react'
import { Explication, MontantPrimeTravaux, Priorité } from '../DPETravaux'
import { Card, CTA, PrimeStyle } from '@/components/UI'
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
    setQuestions(questions)
  }
  return (
    <table>
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
                  <td>
                    <Dot />
                    {rules[e[0]].titre}
                  </td>
                  <td
                    css={`
                      text-align: center;
                    `}
                  >
                    <Priorité valeur={dpe[e[1]]} />
                  </td>
                  <td>
                    <Explication geste={e[0]} dpe={dpe} xml={xml} index={i} />
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
                            key={index}
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
                            evaluation: engine.evaluate(e[0] + ' . montant'),
                            situation,
                          }}
                        />
                        <div
                          css={`
                            margin-top: 0.5rem;
                          `}
                        >
                          <AvanceTMO {...{ engine, situation }} />
                        </div>
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
  )
}
