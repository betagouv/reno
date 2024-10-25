'use client'

import InputSwitch from '@/components/InputSwitch'
import { Section } from '@/components/UI'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Publicodes from 'publicodes'
import { Suspense, useMemo } from 'react'
import Stepper from './Stepper'
import simulationConfig from './simulationConfig.yaml'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import useIsInIframe from '@/components/useIsInIframe'
import LogoCompact from '@/components/LogoCompact'

function Form({ rules }) {
  const isInIframe = useIsInIframe()
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  // this param `objectif` lets us optionally build the form to target one specific publicode rule
  const { objectif, ...situationSearchParams } = searchParams

  const target = objectif ? decodeDottedName(objectif) : 'aides'

  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(situationSearchParams, rules),
  ]
  const situation = {
    ...(simulationConfig.situation || {}),
    ...getSituation(situationSearchParams, rules),
  }

  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
  )

  const evaluation = engine.setSituation(validatedSituation).evaluate(target),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      simulationConfig,
      rules,
    )

  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  const setSearchParams = useSetSearchParams()

  return (
    <div>
      <Section>
        {isInIframe && (
          <>
            <LogoCompact
              css={`
                float: right;
              `}
            />
            <Stepper
              {...{
                answeredQuestions,
                nextQuestions,
                currentQuestion,
                rules,
                situation,
              }}
            />
          </>
        )}
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
      </Section>
      {isInIframe && (
        <p
          css={`
            font-size: 0.7rem;
            margin: 0;
            margin-top: 1rem;
            line-height: 1rem;
          `}
        >
          Ceci est une initiative construite avec France&nbsp;Rénov' pour
          simplifier l'information sur les aides à la rénovation énergétique.
        </p>
      )}
    </div>
  )
}

export default function ({ rules }) {
  return (
    <Suspense>
      <Form rules={rules} />
    </Suspense>
  )
}
