'use client'

import InputSwitch from '@/components/InputSwitch'
import { CTA, CTAWrapper, Section } from '@/components/UI'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Publicodes from 'publicodes'
import { Suspense, useMemo } from 'react'
import simulationConfig from './simulationConfig.yaml'
import simulationConfigAdapt from './simulationConfigAdapt.yaml'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import useIsInIframe from '@/components/useIsInIframe'
import { No } from '@/components/ResultUI'
import { CustomQuestionWrapper } from '@/components/CustomQuestionUI'
import Link from 'next/link'

function Form({ rules }) {
  const isInIframe = useIsInIframe()
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  // this param `objectif` lets us optionally build the form to target one specific publicode rule
  const { objectif, ...situationSearchParams } = searchParams

  const target = objectif ? decodeDottedName(objectif) : 'aides'
  const config =
    target == 'mpa . montant'
      ? simulationConfigAdapt.situation || {}
      : simulationConfig.situation || {}

  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(config),
    ...getAnsweredQuestions(situationSearchParams, rules),
  ]
  const situation = {
    ...config,
    ...getSituation(situationSearchParams, rules),
  }

  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
  )

  const evaluation = engine.setSituation(validatedSituation).evaluate(target),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      target == 'mpa . montant' ? simulationConfigAdapt : simulationConfig,
      rules,
    )

  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]
  const setSearchParams = useSetSearchParams()

  return (
    <>
      {
        // Hack pour MPA: il est préférable de gérer l'inéligibilité autrement
        target == 'mpa . montant' && !rule && (
          <CustomQuestionWrapper>
            <CTAWrapper
              $justify="start"
              css={`
                margin-top: 0;
              `}
            >
              <CTA
                $fontSize="normal"
                $importance="emptyBackground"
                css={`
                  a {
                    padding: 0.5rem 0.8rem;
                  }
                `}
              >
                <span onClick={() => history.back()}>⬅ Retour</span>
              </CTA>
            </CTAWrapper>
            <header>
              <small>Eligibilité</small>
            </header>
            <p>
              Vous n'êtes <No>pas éligible</No> au dispositif MaPrimeAdapt'.
            </p>
          </CustomQuestionWrapper>
        )
      }
      {rule && (
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
      )}
      {isInIframe && (
        <p
          css={`
            font-size: 0.7rem;
            margin: 0 1rem;
            line-height: 1rem;
          `}
        >
          Un simulateur construit avec France&nbsp;Rénov' pour simplifier
          l'information sur les aides à la rénovation énergétique.
        </p>
      )}
    </>
  )
}

export default function ({ rules }) {
  return (
    <Suspense>
      <Form rules={rules} />
    </Suspense>
  )
}
