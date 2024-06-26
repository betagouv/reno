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
import Link from '@/node_modules/next/link'
import Publicodes from 'publicodes'
import { Suspense, useMemo } from 'react'
import Answers from './Answers'
import Share from './Share'
import simulationConfig from './simulationConfig.yaml'
import UserProblemBanner from '@/components/UserProblemBanner'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'

function Form({ rules }) {
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
  const started =
    answeredQuestions.filter((el) => el === 'simulation . mode').length > 1 // because of simulation mode

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
        <Answers
          {...{
            answeredQuestions,
            nextQuestions,
            currentQuestion,
            rules,
            situation,
          }}
        />
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
      <br />
      <UserProblemBanner />
      <Share searchParams={searchParams} />
      <Section>
        <h2>Documentation</h2>
        <p>
          Si vous êtes experts, vous pouvez parcourir notre{' '}
          <Link
            href={
              '/documentation/MPR/?' +
              new URLSearchParams(situationSearchParams).toString()
            }
          >
            documentation complète du calcul
          </Link>
          .
        </p>
      </Section>
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
