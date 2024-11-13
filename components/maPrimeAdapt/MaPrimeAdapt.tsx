'use client'

import InputSwitch from '@/components/InputSwitch'
import { Section } from '@/components/UI'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import rules from '@/app/règles/rules'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Publicodes from 'publicodes'
import simulationConfigAdapt from '@/app/simulation/simulationConfigAdapt.yaml'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { omit } from '../utils'
import MaPrimeAdaptOccupant from './MaPrimeAdaptOccupant'
import MaPrimeAdaptBailleur from './MaPrimeAdaptBailleur'

export default function MaPrimeAdapt() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfigAdapt.situation || {}),
    ...getAnsweredQuestions(searchParams, rules),
  ]
  const situation = {
    ...(simulationConfigAdapt.situation || {}),
    ...getSituation(searchParams, rules),
  }

  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
  )
  const evaluation = engine
    .setSituation(validatedSituation)
    .evaluate('mpa . montant')
  console.log('est', evaluation)
  // On ne pose pas la question du montant des travaux dans le formulaire
  // Il sera modifiable dans l'explication
  const nextQuestions = getNextQuestions(
    evaluation,
    answeredQuestions,
    simulationConfigAdapt,
    rules,
  ).filter((q) => q != 'mpa . montant travaux')
  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]
  const setSearchParams = useSetSearchParams()
  return (
    <>
      {rule || searchParams['details'] ? (
        <InputSwitch
          {...{
            rules,
            currentQuestion,
            situation,
            answeredQuestions,
            setSearchParams,
            engine,
            nextQuestions,
            searchParams,
          }}
        />
      ) : (
        <Section>
          <CustomQuestionWrapper>
            <BtnBackToParcoursChoice
              {...{
                setSearchParams,
                situation: omit([], situation), //TODO: trouver un fonction pour ce bouton retour
                answeredQuestions,
              }}
            />
            <header>
              <small>Aides disponibles</small>
              <h2
                css={`
                  font-size: 120%;
                  margin: 0.5rem 0 !important;
                `}
              >
                Financer l'adaptation de votre logement
              </h2>
            </header>
            {situation['mpa . situation demandeur'] == '"occupant"' && (
              <MaPrimeAdaptOccupant
                {...{
                  rules,
                  currentQuestion,
                  situation,
                  answeredQuestions,
                  setSearchParams,
                  engine,
                  nextQuestions,
                  searchParams,
                }}
              />
            )}
            {situation['mpa . situation demandeur'] == '"bailleur"' && (
              <MaPrimeAdaptBailleur
                {...{
                  rules,
                  currentQuestion,
                  situation,
                  answeredQuestions,
                  setSearchParams,
                  engine,
                  nextQuestions,
                  searchParams,
                }}
              />
            )}
          </CustomQuestionWrapper>
        </Section>
      )}
    </>
  )
}
